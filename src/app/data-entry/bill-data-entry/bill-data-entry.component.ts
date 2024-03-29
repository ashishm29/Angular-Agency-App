import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { AppConstant } from 'src/app/appConstant';
import { BillDetails, Route, StoreDetails } from 'src/app/models/route';
import { BillService } from 'src/app/services/bill.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { RouteService } from 'src/app/services/route.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { StoreService } from 'src/app/services/store.service';
import { ValidationDialogService } from 'src/app/services/validation-dialog.service';

@Component({
  selector: 'app-bill-data-entry',
  templateUrl: './bill-data-entry.component.html',
  styleUrls: ['./bill-data-entry.component.scss'],
})
export class BillDataEntryComponent implements OnInit {
  @ViewChild('billFormDirective') private billFormDirective!: NgForm;
  routeName!: string;
  routeCollection: Route[] = [];
  storeCollection: StoreDetails[] = [];
  myControl = new UntypedFormControl();
  billFormGroup!: UntypedFormGroup;
  filteredOptions: Observable<StoreDetails[]> | undefined;
  isClicked: boolean = false;
  buttonText: string = AppConstant.ADD_BILL_BTN_TEXT;
  localRouteValue!: string;

  constructor(
    public storeService: StoreService,
    public billService: BillService,
    private routeService: RouteService,
    private datePipe: DatePipe,
    private snackbarService: SnackBarService,
    private validationDialogService: ValidationDialogService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.initialize();
    this.onFetchRoute();

    if (this.localRouteValue) {
      this.onRouteSelectionChange(this.localRouteValue);
    }
  }

  onAddBill() {
    if (this.billFormGroup.invalid) {
      console.log('bill form is invalid');
      return;
    }

    if (this.isClicked) {
      return;
    }

    this.isClicked = true;
    this.buttonText = AppConstant.PLEASE_WAIT_BTN_TEXT;

    let billDetails = {
      ...this.billFormGroup.value,
      pendingAmount: this.billFormGroup.value.billAmount,
      createdDate: this.datePipe.transform(
        Date.now().toString(),
        AppConstant.DATE_TIME_FORMAT
      ),
    } as BillDetails;

    this.billService
      .getFilteredBillsByBillNumber(billDetails.billNumber)
      .then((result) => {
        if (result != null && result.length > 0) {
          this.validationDialogService.openValidationDialog(
            AppConstant.ADD_BILL_VALIDATION
          );
          this.reset();
        } else {
          this.addBill(billDetails);
        }
      })
      .catch((err) => {
        console.log(err);
        this.snackbarService.openSnackBar(err, AppConstant.ERROR_ACTION);
        this.reset();
      });
  }

  addBill(billDetails: BillDetails) {
    this.billService
      .addBillDetails(billDetails)
      .then(() => {
        console.log(AppConstant.BILL_ADDED_SUCCESS_MSG);
        this.snackbarService.openSnackBar(
          AppConstant.BILL_ADDED_SUCCESS_MSG,
          AppConstant.SAVE_ACTION
        );
        this.reset();
      })
      .catch((err) => {
        console.log(err);
        this.snackbarService.openSnackBar(err, AppConstant.ERROR_ACTION);
        this.reset();
      });
  }

  reset() {
    this.isClicked = false;
    this.buttonText = AppConstant.ADD_BILL_BTN_TEXT;
    this.initialize();
  }

  initialize() {
    this.localRouteValue = this.localStorageService.getKeyValue(
      AppConstant.ROUTE_LOCAL_STORAGE_KEY
    ) as string;

    this.billFormGroup = new UntypedFormGroup({
      route: new UntypedFormControl(this.localRouteValue, [
        Validators.required,
      ]),
      storeName: new UntypedFormControl('', [Validators.required]),
      billNumber: new UntypedFormControl('', [Validators.required]),
      billDate: new UntypedFormControl('', [Validators.required]),
      billAmount: new UntypedFormControl('', [Validators.required]),
      address: new UntypedFormControl(),
      comment: new UntypedFormControl(),
    });

    if (this.billFormDirective) {
      this.billFormDirective.resetForm();
    }

    this.storeNameValueChange();
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

  onFetchStoreDetails(selecetdValue: string) {
    this.storeCollection = [];
    this.storeService.getStores(selecetdValue).then((result) => {
      if (result && result.length > 0) {
        this.storeCollection = result;
        this.storeNameValueChange();
      } else {
        console.log(AppConstant.STORE_NOT_FOUND_MSG);
      }
    });
  }

  storeNameValueChange() {
    let routeControl = this.billFormGroup.controls['storeName'];
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

  onRouteSelectionChange(selecetdValue: string) {
    console.log(selecetdValue);
    this.localStorageService.setKeyValue(
      AppConstant.ROUTE_LOCAL_STORAGE_KEY,
      selecetdValue
    );
    if (selecetdValue) {
      this.billFormGroup.get('storeName')?.reset();
      this.billFormGroup.get('billNumber')?.reset();
      this.billFormGroup.get('billDate')?.reset();
      this.billFormGroup.get('billAmount')?.reset();
      this.billFormGroup.get('comment')?.reset();
      this.onFetchStoreDetails(selecetdValue);
    }
  }

  onStoreSelected(selectedStore: StoreDetails) {
    this.billFormGroup.patchValue({
      address: selectedStore.address,
    });
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
}
