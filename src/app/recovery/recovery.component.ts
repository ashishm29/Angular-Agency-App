import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppConstant } from '../appConstant';
import {
  BillDetails,
  PaymentMode,
  RecoveryDetails,
  Route,
  StoreDetails,
} from '../models/route';
import { RecoveryService } from '../services/recovery.service';
import { Observable, map, startWith } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { BillService } from '../services/bill.service';
import { StoreService } from '../services/store.service';
import { RouteService } from '../services/route.service';
import { AuthService } from '../services/auth.service';
import { SnackBarService } from '../services/snackbar.service';
import { ValidationDialogService } from '../services/validation-dialog.service';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.scss'],
})
export class RecoveryComponent implements OnInit {
  recoveryFormGroup!: FormGroup;
  routeCollection: Route[] = [];
  modeOfPaymentCollection: PaymentMode[] = [];
  storeCollection: StoreDetails[] = [];
  filteredOptions: Observable<StoreDetails[]> | undefined;
  billCollection: BillDetails[] = [];
  filteredBillNumbers: Observable<BillDetails[]> | undefined;
  selecetdBill!: BillDetails;
  pendingValidation!: boolean;
  isClicked: boolean = false;
  buttonText: string = AppConstant.SUBMIT_BTN_TEXT;

  constructor(
    public recoveryService: RecoveryService,
    public storeService: StoreService,
    public routeService: RouteService,
    private billService: BillService,
    private authservice: AuthService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private snackbarService: SnackBarService,
    private validationService: ValidationDialogService
  ) {}

  ngOnInit(): void {
    this.initializeFormGroup();
    this.getPaymentModes();
    this.onFetchRoute();
  }

  initializeFormGroup() {
    this.recoveryFormGroup = new FormGroup({
      route: new FormControl('', [Validators.required]),
      storeName: new FormControl('', [Validators.required]),
      address: new FormControl(),
      billNumber: new FormControl('', [Validators.required]),
      billAmount: new FormControl('', [Validators.required]),
      amountReceived: new FormControl('', [Validators.required]),
      pendingAmount: new FormControl(),
      receiptNumber: new FormControl('', [Validators.required]),
      modeOfPayment: new FormControl('', [Validators.required]),
      comment: new FormControl(),
    });
  }

  getPaymentModes() {
    this.recoveryService.getPaymentModes().then((result) => {
      if (result && result.length > 0) {
        this.modeOfPaymentCollection = result;
      } else {
        console.log(AppConstant.PAYMENT_MODES_NOT_FOUND_MSG);
      }
    });
  }

  onFetchRoute() {
    this.routeCollection = [];
    this.routeService.getRoutes().then((result) => {
      if (result && result.length > 0) {
        this.routeCollection = result;
      } else {
        console.log(AppConstant.ROUTE_NOT_FOUND_MSG);
      }
    });
  }

  onRouteSelectionChange(selecetdValue: string) {
    console.log(selecetdValue);
    if (selecetdValue) {
      this.recoveryFormGroup.get('storeName')?.reset();
      this.recoveryFormGroup.get('address')?.reset();
      this.recoveryFormGroup.get('billNumber')?.reset();
      this.recoveryFormGroup.get('billAmount')?.reset();
      this.recoveryFormGroup.get('amountReceived')?.reset();
      this.recoveryFormGroup.get('pendingAmount')?.reset();
      this.recoveryFormGroup.get('modeOfPayment')?.reset();
      this.recoveryFormGroup.get('comment')?.reset();
      this.onFetchStoreDetails(selecetdValue);
    }
  }

  onFetchStoreDetails(selecetdValue: string) {
    this.storeCollection = [];
    this.storeService.getStores(selecetdValue).then((result) => {
      if (result && result.length > 0) {
        this.storeCollection = result;
        this.subscribeBill_StoreNameValueChange();
      } else {
        console.log(AppConstant.STORE_NOT_FOUND_MSG);
      }
    });
  }

  subscribeBill_StoreNameValueChange() {
    let routeControl = this.recoveryFormGroup.controls['storeName'];
    this.filteredOptions = routeControl?.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name
          ? this._filter(name as string)
          : this.storeCollection.slice();
      })
    );
  }

  displayBillNumberFn(user: BillDetails): string {
    return user && user.billNumber ? user.billNumber : '';
  }

  private _filterBillNumber(name: string): BillDetails[] {
    const filterValue = name.toLowerCase();

    return this.billCollection.filter((option) =>
      option.billNumber.toLowerCase().includes(filterValue)
    );
  }

  subscribeBillNumberValueChange() {
    let control = this.recoveryFormGroup.controls['billNumber'];
    this.filteredBillNumbers = control?.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name
          ? this._filterBillNumber(name as string)
          : this.billCollection.slice();
      })
    );
  }

  displayFn(user: StoreDetails): string {
    return user && user.storeName ? user.storeName : '';
  }

  private _filter(name: string): StoreDetails[] {
    const filterValue = name.toLowerCase();

    return this.storeCollection.filter((option) =>
      option.storeName.toLowerCase().includes(filterValue)
    );
  }

  onStoreSelected(selectedStore: StoreDetails) {
    this.recoveryFormGroup.patchValue({
      address: selectedStore.address,
      mobileNo: selectedStore.mobileNo,
    });

    this.getBillsForSelectedStore(selectedStore.storeName);
  }

  onBillSelected(selectedBill: string) {
    const billobject = this.billCollection.find(
      (c) => c.billNumber == selectedBill
    ) as BillDetails;

    if (billobject) {
      this.selecetdBill = billobject;
      this.recoveryFormGroup.patchValue({
        billAmount: billobject.pendingAmount ?? 0,
        pendingAmount: billobject.pendingAmount ?? 0,
        comment: billobject.comment ?? '',
      });
    }
  }

  getBillsForSelectedStore(selecetdValue: string) {
    this.billCollection = [];
    this.billService
      .getFilteredBillsByStoreName(selecetdValue)
      .then((result) => {
        if (result && result.length > 0) {
          this.billCollection = this.sortData(result);
        } else {
          console.log(AppConstant.STORE_NOT_FOUND_MSG);
        }

        this.subscribeBillNumberValueChange();
      });
  }

  sortData(result: BillDetails[]) {
    return result.sort((a, b) => {
      try {
        return <any>a.billDate.toDate() - <any>b.billDate.toDate();
      } catch {
        console.log('Exception occured ');
        return 0;
      }
    });
  }

  onAddRecoveryData() {
    if (this.recoveryFormGroup.invalid) {
      console.log('recovery form is invalid');
      return;
    }

    if (
      +this.recoveryFormGroup.value.billAmount -
        +this.recoveryFormGroup.value.amountReceived <
      0
    ) {
      this.validationService.openValidationDialog(
        AppConstant.ADD_BILL_PENDING_AMT_VALIDATION
      );
      return;
    } else if (
      +this.recoveryFormGroup.value.billAmount ===
      +this.recoveryFormGroup.value.pendingAmount
    ) {
      this.validationService.openValidationDialog(
        AppConstant.ADD_RECOVERY_BILL_AND_PENDING_AMT_VALIDATION
      );
      return;
    }

    if (this.isClicked) {
      return;
    }
    this.isClicked = true;
    this.buttonText = AppConstant.PLEASE_WAIT_BTN_TEXT;

    let recoveryDetail = {
      ...this.recoveryFormGroup.value,
      recoveryDate: new Date(),
      createdDate: this.datePipe.transform(
        Date.now().toString(),
        AppConstant.DATE_TIME_FORMAT
      ),
      recoveryAgent: this.authservice.getuserDetails().username,
    } as RecoveryDetails;

    this.recoveryService
      .addRecoveryDetails(recoveryDetail)
      .then(() => {
        console.log(AppConstant.RECOVERY_ADDED_SUCCESS_MSG);
        this.snackbarService.openSnackBar(
          AppConstant.RECOVERY_ADDED_SUCCESS_MSG,
          AppConstant.SAVE_ACTION
        );
        this.updateBillPendingAmount();
        this.initializeFormGroup();
      })
      .catch((err) => {
        console.log(err);
        this.snackbarService.openSnackBar(err, AppConstant.ERROR_ACTION);
      })
      .finally(() => {
        this.isClicked = false;
        this.buttonText = AppConstant.SUBMIT_BTN_TEXT;
      });
  }

  updateBillPendingAmount() {
    let bill = {
      ...this.selecetdBill,
      pendingAmount: this.recoveryFormGroup.value.pendingAmount,
      updatedDate: this.datePipe.transform(
        Date.now().toString(),
        AppConstant.DATE_TIME_FORMAT
      ),
    } as BillDetails;

    this.billService
      .updateBillPendingAmount(bill)
      .then(() => {
        console.log(AppConstant.BILL_UPDATED_SUCCESS_MSG);
        this.snackbarService.openSnackBar(
          AppConstant.BILL_UPDATED_SUCCESS_MSG,
          AppConstant.UPDAE_ACTION
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  OnAmountReceivedChanged() {
    const billAmt = +this.recoveryFormGroup.value.billAmount;
    const receivedAmt = +this.recoveryFormGroup.value.amountReceived;
    const pendingAmt = billAmt - receivedAmt;

    if (billAmt - receivedAmt < 0) {
      this.pendingValidation = true;
    } else {
      this.pendingValidation = false;
    }

    console.log(pendingAmt);
    this.recoveryFormGroup.patchValue({
      pendingAmount: pendingAmt,
    });
  }

  OnBillNumberChanged() {
    this.recoveryFormGroup.patchValue({
      billAmount: '',
      pendingAmount: '',
      amountReceived: '',
      receiptNumber: '',
      modeOfPayment: '',
      comment: '',
    });
  }

  getBillDate(element: BillDetails) {
    try {
      return this.datePipe.transform(element.billDate.toDate(), 'dd-MM-yyyy');
    } catch {
      return element.billDate;
    }
  }
}
