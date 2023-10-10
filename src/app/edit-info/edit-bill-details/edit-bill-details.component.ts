import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConstant } from 'src/app/appConstant';
import { BillDetails } from 'src/app/models/route';
import { BillService } from 'src/app/services/bill.service';

@Component({
  selector: 'app-edit-bill-details',
  templateUrl: './edit-bill-details.component.html',
  styleUrls: ['./edit-bill-details.component.scss'],
})
export class EditBillDetailsComponent implements OnInit {
  billFormGroup!: FormGroup;
  billFormBillNoControl = new FormControl();
  selectedBillToUpdate!: BillDetails;
  billCollection: BillDetails[] = [];

  constructor(
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private billService: BillService
  ) {}

  ngOnInit(): void {
    this.billFormBillNoControl = new FormControl();
    this.initializeBillUiFields();
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

  searchBill() {
    this.billCollection = [];
    this.billService
      .getFilteredBills('', '', '', '', this.billFormBillNoControl.value)
      .then((result) => {
        if (result && result.length > 0) {
          let splitDate = result[0].billDate.split('/');
          this.selectedBillToUpdate = result[0];

          this.billFormGroup.patchValue({
            ...result[0],
            billDate: new Date(+splitDate[2], +splitDate[1] - 1, +splitDate[0]),
          });
        } else {
          console.log(AppConstant.BILL_NOT_FOUND_MSG);
          this.openSnackBar(
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
      billDate: this.billFormGroup.value.billDate.toLocaleDateString(),
      billAmount: this.billFormGroup.value.billAmount,
      pendingAmount: this.billFormGroup.value.billAmount,
      updatedDate: this.datePipe.transform(
        Date.now().toString(),
        AppConstant.DATE_TIME_FORMAT
      ),
    } as BillDetails;

    this.billService
      .updateBillDetails(billDetails)
      .then(() => {
        console.log(AppConstant.BILL_UPDATED_SUCCESS_MSG);
        this.openSnackBar(
          AppConstant.BILL_UPDATED_SUCCESS_MSG,
          AppConstant.UPDAE_ACTION
        );
        this.initializeBillUiFields();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
