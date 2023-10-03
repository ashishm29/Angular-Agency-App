import { Component, OnInit } from '@angular/core';
import { DataEntryService } from '../services/data-entry.service';
import { BillDetails, Route, StoreDetails } from '../models/route';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { Observable, map, of, startWith, tap } from 'rxjs';
import { AppConstant } from '../appConstant';

@Component({
  selector: 'app-data-entry',
  templateUrl: './data-entry.component.html',
  styleUrls: ['./data-entry.component.scss'],
})
export class DataEntryComponent implements OnInit {
  constructor(
    public entryService: DataEntryService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {}

  routeName!: string;
  routeCollection: Route[] = [];
  storeCollection: StoreDetails[] = [];
  filteredOptions: Observable<StoreDetails[]> | undefined;
  myControl = new FormControl();

  routeFormGroup!: FormGroup;
  shopFormGroup!: FormGroup;
  billFormGroup!: FormGroup;
  showRouteControls!: boolean;
  showShopControls!: boolean;
  showBillControls!: boolean;

  ngOnInit(): void {
    this.initializeRouteUiFields();
    this.initializeStoreUiFields();
    this.initializeBillUiFields();
  }

  onAddRoute() {
    if (this.routeFormGroup.invalid) {
      console.log('route form is invalid');
      return;
    }

    let route = {
      routeName: this.routeFormGroup.value.route,
      createdDate: this.datePipe.transform(
        Date.now().toString(),
        AppConstant.DATE_TIME_FORMAT
      ),
    } as Route;

    const newLocal = this;
    newLocal.entryService
      .addRoute(route)
      .then(() => {
        console.log(AppConstant.ROUTE_ADDED_SUCCESS_MSG);
        this.openSnackBar(
          AppConstant.ROUTE_ADDED_SUCCESS_MSG,
          AppConstant.SAVE_ACTION
        );
        this.initializeRouteUiFields();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onAddStore() {
    if (this.shopFormGroup.invalid) {
      console.log('store form is invalid');
      return;
    }

    let shopDetails = {
      route: this.shopFormGroup.value.route,
      storeName: this.shopFormGroup.value.storeName,
      address: this.shopFormGroup.value.address,
      mobileNo: this.shopFormGroup.value.mobileNo,
      altMobileNo: this.shopFormGroup.value.altMobileNo,
      createdDate: this.datePipe.transform(
        Date.now().toString(),
        AppConstant.DATE_TIME_FORMAT
      ),
    } as StoreDetails;

    this.entryService
      .addStoreDetails(shopDetails)
      .then(() => {
        console.log(AppConstant.STORE_ADDED_SUCCESS_MSG);
        this.openSnackBar(
          AppConstant.STORE_ADDED_SUCCESS_MSG,
          AppConstant.SAVE_ACTION
        );
        this.initializeStoreUiFields();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onAddBill() {
    if (this.billFormGroup.invalid) {
      console.log('bill form is invalid');
      return;
    }

    let billDetails = {
      route: this.billFormGroup.value.route,
      storeName: this.billFormGroup.value.storeName,
      billNumber: this.billFormGroup.value.billNumber,
      billDate: this.billFormGroup.value.billDate.toLocaleDateString(),
      billAmount: this.billFormGroup.value.billAmount,
      pendingAmount: this.billFormGroup.value.billAmount,
      createdDate: this.datePipe.transform(
        Date.now().toString(),
        AppConstant.DATE_TIME_FORMAT
      ),
    } as BillDetails;

    this.entryService
      .addBillDetails(billDetails)
      .then(() => {
        console.log(AppConstant.BILL_ADDED_SUCCESS_MSG);
        this.openSnackBar(
          AppConstant.BILL_ADDED_SUCCESS_MSG,
          AppConstant.SAVE_ACTION
        );
        this.initializeBillUiFields();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  initializeStoreUiFields() {
    this.shopFormGroup = new FormGroup({
      route: new FormControl('', [Validators.required]),
      storeName: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      mobileNo: new FormControl('', [
        Validators.required,
        Validators.min(1000000000),
        Validators.max(99999999999),
      ]),
      altMobileNo: new FormControl(),
    });
  }

  initializeBillUiFields() {
    this.billFormGroup = new FormGroup({
      route: new FormControl('', [Validators.required]),
      storeName: new FormControl('', [Validators.required]),
      billNumber: new FormControl('', [Validators.required]),
      billDate: new FormControl('', [Validators.required]),
      billAmount: new FormControl('', [Validators.required]),
      address: new FormControl(),
    });
  }

  initializeRouteUiFields() {
    this.routeFormGroup = new FormGroup({
      route: new FormControl('', [Validators.required]),
    });
  }

  onFetchRoute() {
    this.routeCollection = [];
    this.entryService.getRoutes().then((result) => {
      if (result && result.length > 0) {
        this.routeCollection = result;
      } else {
        console.log(AppConstant.ROUTE_NOT_FOUND_MSG);
      }
    });
  }

  onFetchStoreDetails(selecetdValue: string) {
    this.storeCollection = [];
    this.entryService.getStores(selecetdValue).then((result) => {
      if (result && result.length > 0) {
        this.storeCollection = result;
        this.subscribeBill_StoreNameValueChange();
      } else {
        console.log(AppConstant.STORE_NOT_FOUND_MSG);
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  onSelectionChange(selecetdValue: string) {
    console.log(selecetdValue);
    this.showRouteControls = false;
    this.showShopControls = false;
    this.showBillControls = false;
    this.initializeBillUiFields();
    this.initializeStoreUiFields();

    if (selecetdValue) {
      if (selecetdValue === 'store') {
        this.onFetchRoute();
        this.showShopControls = true;
      } else if (selecetdValue === 'route') {
        this.showRouteControls = true;
      } else if (selecetdValue === 'bill') {
        this.onFetchRoute();
        this.showBillControls = true;
      }
    }
  }

  subscribeBill_StoreNameValueChange() {
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

  onBillForm_RouteSelectionChange(selecetdValue: string) {
    console.log(selecetdValue);
    if (selecetdValue) {
      this.billFormGroup.get('storeName')?.reset();
      this.billFormGroup.get('billNumber')?.reset();
      this.billFormGroup.get('billDate')?.reset();
      this.billFormGroup.get('billAmount')?.reset();
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
