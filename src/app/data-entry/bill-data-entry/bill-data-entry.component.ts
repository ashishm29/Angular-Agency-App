import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { MY_SERVICE_TOKEN } from 'src/app/app.module';
import { AppConstant } from 'src/app/appConstant';
import { StoreRouteService } from 'src/app/interface/StoreRouteService';
import { BillDetails } from 'src/app/models/route';
import { BillService } from 'src/app/services/bill.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { ValidationDialogService } from 'src/app/services/validation-dialog.service';

@Component({
  selector: 'app-bill-data-entry',
  templateUrl: './bill-data-entry.component.html',
  styleUrls: ['./bill-data-entry.component.scss'],
})
export class BillDataEntryComponent implements OnInit {
  @ViewChild('billFormDirective') private billFormDirective!: NgForm;
  routeName!: string;
  myControl = new UntypedFormControl();
  isClicked: boolean = false;
  buttonText: string = AppConstant.ADD_BILL_BTN_TEXT;
  localRouteValue!: string;

  constructor(
    public billService: BillService,
    private datePipe: DatePipe,
    private snackbarService: SnackBarService,
    private validationDialogService: ValidationDialogService,
    private localStorageService: LocalStorageService,
    @Inject(MY_SERVICE_TOKEN) public storeRouteService: StoreRouteService
  ) {}

  ngOnInit(): void {
    this.initialize();
    this.storeRouteService.onFetchRoute();

    if (this.localRouteValue) {
      this.storeRouteService.onRouteSelectionChange(this.localRouteValue);
    }
  }

  onAddBill() {
    if (this.storeRouteService.billFormGroup.invalid) {
      console.log('bill form is invalid');
      return;
    }

    if (this.isClicked) {
      return;
    }

    this.isClicked = true;
    this.buttonText = AppConstant.PLEASE_WAIT_BTN_TEXT;

    let billDetails = {
      ...this.storeRouteService.billFormGroup.value,
      pendingAmount: this.storeRouteService.billFormGroup.value.billAmount,
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

    this.storeRouteService.billFormGroup = new UntypedFormGroup({
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

    this.storeRouteService.subscribeStoreNameValueChange();
  }
}
