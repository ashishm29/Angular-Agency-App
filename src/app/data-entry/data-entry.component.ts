import { Component, OnInit } from '@angular/core';
import { DataEntryService } from '../services/data-entry.service';
import { BillDetails, Route, StoreDetails } from '../models/route';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { Observable, map, of, startWith } from 'rxjs';

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
  storeArray: StoreDetails[] = [];
  filteredOptions: Observable<StoreDetails[]> | undefined;
  myControl = new FormControl();

  shopFormGroup!: FormGroup;
  billFormGroup!: FormGroup;
  showRouteControls!: boolean;
  showShopControls!: boolean;
  showBillControls!: boolean;

  ngOnInit(): void {
    this.resetStoreUiFields();
    this.resetBillUiFields();

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.storeArray.slice();
      })
    );
  }

  onSelectionChange(selecetdValue: string) {
    console.log(selecetdValue);
    this.showRouteControls = false;
    this.showShopControls = false;
    this.showBillControls = false;
    this.resetBillUiFields();
    this.resetStoreUiFields();

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

  // onBillForm_StoreSelectionChange(selecetdValue: string) {
  //   console.log(selecetdValue);
  //   // if (selecetdValue) {
  //   //   this.storeCollection.forEach((element) => {
  //   //     if (element.storeName == selecetdValue) {
  //   //       this.billFormGroup.patchValue({
  //   //         address: element.address,
  //   //       });
  //   //     }
  //   //   });
  //   // }
  // }

  onAddRoute() {
    let route = {
      routeName: this.routeName,
      createdDate: this.datePipe.transform(Date.now().toString(), 'yyyy-MM-dd'),
    } as unknown as Route;

    const newLocal = this;
    newLocal.entryService
      .addRoute(route)
      .then(() => {
        console.log('Route added Successfully');
        this.openSnackBar('Route added Successfully', 'Saved');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onAddStore() {
    let shopDetails = {
      route: this.shopFormGroup.value.route,
      storeName: this.shopFormGroup.value.storeName,
      address: this.shopFormGroup.value.address,
      mobileNo: this.shopFormGroup.value.mobileNo,
      altMobileNo: this.shopFormGroup.value.altMobileNo,
      createdDate: this.datePipe.transform(Date.now().toString(), 'yyyy-MM-dd'),
    } as unknown as StoreDetails;

    this.entryService
      .addStoreDetails(shopDetails)
      .then(() => {
        console.log('Store added Successfully');
        this.openSnackBar('Store added Successfully', 'Saved');
        this.resetStoreUiFields();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onAddBill() {
    let billDetails = {
      route: this.billFormGroup.value.route,
      storeName: this.billFormGroup.value.storeName,
      billNumber: this.billFormGroup.value.billNumber,
      billDate: this.billFormGroup.value.billDate,
      billAmount: this.billFormGroup.value.billAmount,
      createdDate: this.datePipe.transform(Date.now().toString(), 'yyyy-MM-dd'),
    } as unknown as BillDetails;

    this.entryService
      .addBillDetails(billDetails)
      .then(() => {
        console.log('Bill added Successfully');
        this.openSnackBar('Bill added Successfully', 'Saved');
        this.resetStoreUiFields();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  resetStoreUiFields() {
    this.shopFormGroup = new FormGroup({
      route: new FormControl(),
      storeName: new FormControl(),
      address: new FormControl(),
      mobileNo: new FormControl(),
      altMobileNo: new FormControl(),
    });
  }

  resetBillUiFields() {
    this.billFormGroup = new FormGroup({
      route: new FormControl(),
      storeName: new FormControl(),
      billNumber: new FormControl(),
      billDate: new FormControl(),
      billAmount: new FormControl(),
      address: new FormControl(),
    });
  }

  onFetchRoute() {
    this.routeCollection = [];
    this.entryService.getRoutes().then((result) => {
      if (result && result.length > 0) {
        this.routeCollection = result;
      } else {
        console.log('No routes found');
      }
    });
  }

  onFetchStoreDetails(selecetdValue: string) {
    this.storeArray = [];
    this.entryService.getStores(selecetdValue).then((result) => {
      if (result && result.length > 0) {
        this.storeArray = result;
      } else {
        console.log('No stores found');
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  displayFn(user: StoreDetails): string {
    return user && user.storeName ? user.storeName : '';
  }

  private _filter(name: string): StoreDetails[] {
    const filterValue = name.toLowerCase();

    return this.storeArray.filter((option) =>
      option.storeName.toLowerCase().includes(filterValue)
    );
  }

  onStoreSelected(selectedStore: StoreDetails) {
    this.billFormGroup.patchValue({
      address: selectedStore.address,
    });
  }
}
