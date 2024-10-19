import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs';
import { AppConstant } from 'src/app/appConstant';
import { BillDetails, RecoveryDetails } from 'src/app/models/route';
import { BillService } from 'src/app/services/bill.service';
import { RecoveryService } from 'src/app/services/recovery.service';
import { SnackBarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-edit-bill-details',
  templateUrl: './edit-bill-details.component.html',
  styleUrls: ['./edit-bill-details.component.scss'],
})
export class EditBillDetailsComponent implements OnInit {
  billFormGroup!: UntypedFormGroup;
  billFormBillNoControl = new UntypedFormControl();
  selectedBillToUpdate!: BillDetails;
  billCollection: BillDetails[] = [];
  isNavigated = false;

  constructor(
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private billService: BillService,
    private snackbarService: SnackBarService,
    private recoveryService: RecoveryService
  ) {
    this.billFormBillNoControl = new UntypedFormControl();
    this.initializeBillUiFields();

    this.isNavigated = false;
    this.billService.parameters
      .pipe(
        map((values) => {
          this.isNavigated = true;
          this.billFormBillNoControl = new UntypedFormControl();
          this.populateData(values.params);
        })
      )
      .subscribe();
  }

  ngOnInit(): void {}

  populateData(details: BillDetails) {
    this.initializeBillUiFields();
    this.billFormBillNoControl.patchValue(details.billNumber);
    this.searchBill();
  }

  initializeBillUiFields() {
    this.billFormGroup = new UntypedFormGroup({
      route: new UntypedFormControl('', [Validators.required]),
      storeName: new UntypedFormControl('', [Validators.required]),
      billNumber: new UntypedFormControl('', [Validators.required]),
      billDate: new UntypedFormControl('', [Validators.required]),
      billAmount: new UntypedFormControl('', [Validators.required]),
      pendingAmount: new UntypedFormControl('', [Validators.required]),
      address: new UntypedFormControl(),
      comment: new UntypedFormControl(),
    });
  }

  searchBill() {
    this.billCollection = [];
    this.billService
      .getFilteredBills('', '', '', '', this.billFormBillNoControl.value)
      .then((result) => {
        if (result && result.length > 0) {
          this.selectedBillToUpdate = result[0];

          let billDate;
          try {
            billDate = result[0].billDate.toDate();
          } catch {
            let splitDate = result[0].billDate.toString().split('/');
            billDate = new Date(
              +splitDate[2],
              +splitDate[1] - 1,
              +splitDate[0]
            );
          }

          this.billFormGroup.patchValue({
            ...result[0],
            billDate: billDate,
            storeName: result[0].storeName.storeName,
          });
        } else {
          console.log(AppConstant.BILL_NOT_FOUND_MSG);
          this.snackbarService.openSnackBar(
            AppConstant.BILL_NOT_FOUND_MSG,
            AppConstant.UPDAE_ACTION
          );
        }
      });
  }

  onUpdateBill() {
    if (this.billFormGroup.invalid || !this.selectedBillToUpdate) {
      console.log('bill form is invalid');
      return;
    }

    let billDetails = {
      ...this.selectedBillToUpdate,
      billNumber: this.billFormGroup.value.billNumber,
      billDate: this.billFormGroup.value.billDate,
      billAmount: this.billFormGroup.value.billAmount,
      pendingAmount: this.billFormGroup.value.pendingAmount,
      comment: this.billFormGroup.value.comment,
      updatedDate: this.datePipe.transform(
        Date.now().toString(),
        AppConstant.DATE_TIME_FORMAT
      ),
    } as BillDetails;

    this.billService
      .updateBillDetails(billDetails)
      .then(() => {
        console.log(AppConstant.BILL_UPDATED_SUCCESS_MSG);
        this.snackbarService.openSnackBar(
          AppConstant.BILL_UPDATED_SUCCESS_MSG,
          AppConstant.UPDAE_ACTION
        );

        this.recoveryService
          .getRecoveryDetails(this.billFormGroup.value.billNumber)
          .then((result) => {
            if (result && result.length > 0) {
              result.forEach((item) => {
                let updatedRecoveryObject = {
                  ...item,
                  billAmount: this.billFormGroup.value.billAmount,
                  pendingAmount: this.billFormGroup.value.pendingAmount,
                } as RecoveryDetails;

                this.recoveryService
                  .updateRecovery(updatedRecoveryObject)
                  .then(() => {
                    this.snackbarService.openSnackBar(
                      AppConstant.BILL_UPDATED_SUCCESS_MSG,
                      AppConstant.UPDAE_ACTION
                    );
                  });
              });
            }

            this.initializeBillUiFields();

            if (this.isNavigated) {
              this.billService.billUpdated.emit();
            }
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onBillAmountChange() {
    let billAmountDiff =
      +this.billFormGroup.value.billAmount -
      +this.selectedBillToUpdate.billAmount;

    let updatedPendingAmount;
    if (billAmountDiff > 0) {
      updatedPendingAmount =
        this.selectedBillToUpdate.pendingAmount + billAmountDiff;
    } else {
      updatedPendingAmount =
        this.selectedBillToUpdate.pendingAmount + billAmountDiff;
    }

    this.billFormGroup.patchValue({
      pendingAmount: updatedPendingAmount,
    });
  }
}
