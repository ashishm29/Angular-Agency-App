import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { AppConstant } from '../appConstant';
import {
  BillDetails,
  BillStatus,
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
import { LocalStorageService } from '../services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.scss'],
})
export class RecoveryComponent implements OnInit {
  recoveryFormGroup!: UntypedFormGroup;
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
  localRouteValue!: string;
  isCheque!: boolean;
  isNavigated = false;
  // parameters = new EventEmitter<{ Params: any }>();

  constructor(
    public recoveryService: RecoveryService,
    public storeService: StoreService,
    public routeService: RouteService,
    private billService: BillService,
    private authservice: AuthService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private snackbarService: SnackBarService,
    private validationService: ValidationDialogService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.isNavigated = false;
    this.recoveryService.parameters
      .pipe(
        map((val) => {
          let routingData = val.params as BillDetails;

          if (routingData) {
            this.selecetdBill = routingData;
            this.isNavigated = true;
          }
          this.prepopulateData(routingData);
        })
      )
      .subscribe();
  }

  async prepopulateData(routingData: BillDetails) {
    await this.getBillsForSelectedStore(
      routingData.storeName.storeName,
      routingData.route,
      false
    );

    if (
      this.billCollection &&
      this.billCollection.some((c) => c.billNumber === routingData.billNumber)
    ) {
      this.recoveryFormGroup = new UntypedFormGroup({
        route: new UntypedFormControl(routingData.route, [Validators.required]),
        storeName: new UntypedFormControl(routingData.storeName, [
          Validators.required,
        ]),
        address: new UntypedFormControl(routingData.storeName.address),
        billNumber: new UntypedFormControl(routingData.billNumber, [
          Validators.required,
        ]),
        billAmount: new UntypedFormControl(routingData.pendingAmount, [
          Validators.required,
        ]),
        amountReceived: new UntypedFormControl(routingData.pendingAmount, [
          Validators.required,
        ]),
        pendingAmount: new UntypedFormControl(0),
        receiptNumber: new UntypedFormControl('', [Validators.required]),
        modeOfPayment: new UntypedFormControl('', [Validators.required]),
        chequeNo: new UntypedFormControl(''),
        comment: new UntypedFormControl(),
      });
    } else {
      this.snackBar.open('Bill is Already Paid.', '', { duration: 2000 });
    }
  }

  ngOnInit(): void {
    this.initializeFormGroup();
    this.getPaymentModes();
    this.onFetchRoute();

    let store = this.localStorageService.getKeyValue(
      AppConstant.STORE_SEARCH_LOCAL_STORAGE_KEY
    ) as string;

    let storeDetail = JSON.parse(store) as StoreDetails;

    if (this.localRouteValue) {
      this.onRouteSelectionChange(this.localRouteValue);
    } else if (storeDetail) {
      this.onRouteSelectionChange(storeDetail.route);
      this.recoveryFormGroup.get('route')?.patchValue(storeDetail.route);
    }

    if (this.selecetdBill) {
      this.prepopulateData(this.selecetdBill);
    }

    if (storeDetail) {
      this.recoveryFormGroup.get('storeName')?.patchValue(storeDetail);
      this.recoveryFormGroup.get('address')?.patchValue(storeDetail?.address);
      this.getBillsForSelectedStore(
        storeDetail.storeName,
        storeDetail.route,
        true
      );
    }
  }

  initializeFormGroup() {
    this.localRouteValue = this.localStorageService.getKeyValue(
      AppConstant.ROUTE_LOCAL_STORAGE_KEY
    ) as string;

    this.recoveryFormGroup = new UntypedFormGroup({
      route: new UntypedFormControl(this.localRouteValue, [
        Validators.required,
      ]),
      storeName: new UntypedFormControl('', [Validators.required]),
      address: new UntypedFormControl(),
      billNumber: new UntypedFormControl('', [Validators.required]),
      billAmount: new UntypedFormControl('', [Validators.required]),
      amountReceived: new UntypedFormControl('', [Validators.required]),
      pendingAmount: new UntypedFormControl(),
      receiptNumber: new UntypedFormControl('', [Validators.required]),
      modeOfPayment: new UntypedFormControl('', [Validators.required]),
      chequeNo: new UntypedFormControl(''),
      comment: new UntypedFormControl(),
    });

    this.subscribeBill_StoreNameValueChange();
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
    this.localStorageService.setKeyValue(
      AppConstant.ROUTE_LOCAL_STORAGE_KEY,
      selecetdValue
    );
    if (selecetdValue) {
      this.resetFields(selecetdValue, true);
    }
  }

  resetFields(route: string, onRouteChange: boolean) {
    if (onRouteChange) {
      this.recoveryFormGroup.get('storeName')?.reset();
      this.recoveryFormGroup.get('address')?.reset();
    }
    this.recoveryFormGroup.get('billNumber')?.reset();
    this.recoveryFormGroup.get('billAmount')?.reset();
    this.recoveryFormGroup.get('amountReceived')?.reset();
    this.recoveryFormGroup.get('pendingAmount')?.reset();
    this.recoveryFormGroup.get('modeOfPayment')?.reset();
    this.recoveryFormGroup.get('comment')?.reset();
    this.recoveryFormGroup.get('receiptNumber')?.reset();
    this.recoveryFormGroup.get('chequeNo')?.reset();
    this.recoveryFormGroup
      .get('chequeNo')
      ?.removeValidators(Validators.required);
    this.isCheque = false;
    this.onFetchStoreDetails(route);
  }

  onPaymentModeChange(val: string) {
    if (val == 'Cheque') {
      this.isCheque = true;
      this.recoveryFormGroup
        .get('chequeNo')
        ?.addValidators(Validators.required);
    } else {
      this.isCheque = false;
      this.recoveryFormGroup.patchValue({
        chequeNo: '',
      });
      this.recoveryFormGroup
        .get('chequeNo')
        ?.removeValidators(Validators.required);
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
    if (selectedStore) {
      this.localStorageService.setKeyValue(
        AppConstant.STORE_SEARCH_LOCAL_STORAGE_KEY,
        JSON.stringify(selectedStore)
      );
    }

    this.recoveryFormGroup.patchValue({
      address: selectedStore.address,
      mobileNo: selectedStore.mobileNo,
    });

    this.getBillsForSelectedStore(
      selectedStore.storeName,
      selectedStore.route,
      true
    );
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

  async getBillsForSelectedStore(
    selecetdValue: string,
    route: string,
    ignoreNewStatusBills: boolean
  ) {
    this.billCollection = [];
    await this.billService
      .getFilteredBillsByStoreName(selecetdValue, route)
      .then((result) => {
        if (result && result.length > 0) {
          if (ignoreNewStatusBills) {
            // DO not show Newly addded bill to salesman for recovery.
            result = result.filter((c) =>
              c.status && c.status == BillStatus.NEW ? false : true
            );
          }
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
        this.resetFields(recoveryDetail.route, false);
        if (this.isNavigated) {
          this.recoveryService.recoveryUpdated.emit();
        }
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
      status: 'PAID',
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
