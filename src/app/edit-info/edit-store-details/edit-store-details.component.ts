import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map, startWith } from 'rxjs';
import { AppConstant } from 'src/app/appConstant';
import { StoreDetails } from 'src/app/models/route';
import { DataEntryService } from 'src/app/services/data-entry.service';

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

  constructor(
    public entryService: DataEntryService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.billStoreControl = new FormControl();
    this.initializeStoreUiFields();
    this.onFetchStoreDetails();
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
    this.entryService.getStores('').then((result) => {
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

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
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
      this.openSnackBar(
        AppConstant.STORE_FORM_INVALID_MSG,
        AppConstant.UPDAE_ACTION
      );
      return;
    }

    let shopDetails = {
      ...this.selectedStoreToUpdate,
      storeName: this.shopFormGroup.value.storeName,
      address: this.shopFormGroup.value.address,
      mobileNo: this.shopFormGroup.value.mobileNo,
      altMobileNo: this.shopFormGroup.value.altMobileNo,
      updatedDate: this.datePipe.transform(
        Date.now().toString(),
        AppConstant.DATE_TIME_FORMAT
      ),
    } as StoreDetails;

    this.entryService
      .updateStoreDetails(shopDetails)
      .then(() => {
        console.log(AppConstant.STORE_UPDATED_SUCCESS_MSG);
        this.openSnackBar(
          AppConstant.STORE_UPDATED_SUCCESS_MSG,
          AppConstant.UPDAE_ACTION
        );
        this.initializeStoreUiFields();
        this.onFetchStoreDetails();
      })
      .catch((err) => {
        console.log(err);
        this.openSnackBar(
          AppConstant.STORE_UPDATED_FAILED_MSG,
          AppConstant.UPDAE_ACTION
        );
      });
  }
}