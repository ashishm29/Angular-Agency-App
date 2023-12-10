import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AppConstant } from 'src/app/appConstant';
import { Route, StoreDetails } from 'src/app/models/route';
import { RouteService } from 'src/app/services/route.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { StoreService } from 'src/app/services/store.service';
import { ValidationDialogService } from 'src/app/services/validation-dialog.service';

@Component({
  selector: 'app-store-data-entry',
  templateUrl: './store-data-entry.component.html',
  styleUrls: ['./store-data-entry.component.scss'],
})
export class StoreDataEntryComponent implements OnInit {
  @ViewChild('storeFormDirective') private storeFormDirective!: NgForm;
  shopFormGroup!: UntypedFormGroup;
  storeCollection: StoreDetails[] = [];
  routeCollection: Route[] = [];
  filteredOptions: Observable<StoreDetails[]> | undefined;

  constructor(
    public storeService: StoreService,
    private datePipe: DatePipe,
    private snackbarService: SnackBarService,
    private validationDialogService: ValidationDialogService,
    private routeService: RouteService
  ) {}

  ngOnInit(): void {
    this.initialize();
    this.onFetchRoute();
  }

  initialize() {
    this.shopFormGroup = new UntypedFormGroup({
      route: new UntypedFormControl('', [Validators.required]),
      storeName: new UntypedFormControl('', [Validators.required]),
      address: new UntypedFormControl('', [Validators.required]),
      mobileNo: new UntypedFormControl('', [
        Validators.required,
        Validators.min(1000000000),
        Validators.max(99999999999),
      ]),
      altMobileNo: new UntypedFormControl(),
    });

    if (this.storeFormDirective) {
      this.storeFormDirective.resetForm();
    }
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

    this.storeService
      .getSpecificStoreDetails(shopDetails)
      .then((result) => {
        if (result != null && result.length > 0) {
          this.validationDialogService.openValidationDialog(
            AppConstant.ADD_STORE_VALIDATION
          );
        } else {
          this.addStore(shopDetails);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  addStore(shopDetails: StoreDetails) {
    this.storeService
      .addStoreDetails(shopDetails)
      .then(() => {
        console.log(AppConstant.STORE_ADDED_SUCCESS_MSG);
        this.snackbarService.openSnackBar(
          AppConstant.STORE_ADDED_SUCCESS_MSG,
          AppConstant.SAVE_ACTION
        );
        this.initialize();
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
