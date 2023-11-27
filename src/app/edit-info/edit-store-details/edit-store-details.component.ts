import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map, startWith } from 'rxjs';
import { AppConstant } from 'src/app/appConstant';
import { Route, StoreDetails } from 'src/app/models/route';
import { BillService } from 'src/app/services/bill.service';
import { RouteService } from 'src/app/services/route.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-edit-store-details',
  templateUrl: './edit-store-details.component.html',
  styleUrls: ['./edit-store-details.component.scss'],
})
export class EditStoreDetailsComponent implements OnInit {
  shopFormGroup!: FormGroup;
  selectedStoreToUpdate!: StoreDetails;
  storeCollection: StoreDetails[] = [];
  filteredOptions: Observable<StoreDetails[]> | undefined;
  billStoreControl = new FormControl();
  routeCollection: Route[] = [];

  constructor(
    public routeService: RouteService,
    public billService: BillService,
    public storeService: StoreService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.billStoreControl = new FormControl();
    this.initializeStoreUiFields();
    this.onFetchStoreDetails();
    this.onFetchRoute();
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

  onFetchStoreDetails() {
    this.storeCollection = [];
    this.storeService.getStores('').then((result) => {
      if (result && result.length > 0) {
        this.storeCollection = result;
        this.subscribeBill_StoreNameValueChange();
      } else {
        console.log(AppConstant.STORE_NOT_FOUND_MSG);
      }
    });
  }

  subscribeBill_StoreNameValueChange() {
    this.filteredOptions = this.billStoreControl?.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name
          ? this._filter(name as string)
          : this.storeCollection.slice();
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
      this.selectedStoreToUpdate = selectedStore;
      this.shopFormGroup.patchValue({
        ...this.selectedStoreToUpdate,
      });
    } else {
      this.selectedStoreToUpdate;
    }
  }

  onUpdateStore() {
    if (this.shopFormGroup.invalid || !this.selectedStoreToUpdate) {
      console.log('store form is invalid');
      this.snackbarService.openSnackBar(
        AppConstant.STORE_FORM_INVALID_MSG,
        AppConstant.UPDAE_ACTION
      );
      return;
    }

    let shopDetails = {
      ...this.shopFormGroup.value,
      id: this.selectedStoreToUpdate.id,
      updatedDate: this.datePipe.transform(
        Date.now().toString(),
        AppConstant.DATE_TIME_FORMAT
      ),
    } as StoreDetails;

    this.storeService
      .updateStoreDetails(shopDetails)
      .then(() => {
        console.log(AppConstant.STORE_UPDATED_SUCCESS_MSG);
        this.snackbarService.openSnackBar(
          AppConstant.STORE_UPDATED_SUCCESS_MSG,
          AppConstant.UPDAE_ACTION
        );
        this.initializeStoreUiFields();
        this.onFetchStoreDetails();
      })
      .catch((err) => {
        console.log(err);
        this.snackbarService.openSnackBar(
          AppConstant.STORE_UPDATED_FAILED_MSG,
          AppConstant.UPDAE_ACTION
        );
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
}
