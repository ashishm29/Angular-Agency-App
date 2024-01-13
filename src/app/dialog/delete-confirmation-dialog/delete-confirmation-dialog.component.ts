import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppConstant } from 'src/app/appConstant';

@Component({
  selector: 'app-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrls: ['./delete-confirmation-dialog.component.scss'],
})
export class DeleteConfirmationDialogComponent implements OnInit {
  message!: string;
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      billNumber: string;
      key: string;
      value: string;
      delete: string;
      object: any;
    }
  ) {}

  ngOnInit(): void {
    if (this.data.billNumber) {
      this.message =
        'Do you want to delete this Bill Number : ' +
        this.data.billNumber +
        ' ?';
    } else if (this.data.key === AppConstant.STORE) {
      this.message =
        'Do you want to delete this Store : ' + this.data.value + ' ?';
    } else if (this.data.key === AppConstant.ROUTE) {
      this.message =
        'Do you want to delete this Route : ' + this.data.value + ' ?';
    } else if (this.data.key === AppConstant.RECOVERY) {
      this.message =
        'Do you want to delete this recovery Receipt Number : ' +
        this.data.value +
        ' ?';
    } else if (this.data.key === AppConstant.ATTENDANCE) {
      this.message = `Do you want to add absent entry for Salesman : ${
        this.data.object.salesman
      } , Date : ${this.data.object.absentDate.toDateString()} `;
    } else if (this.data.key === AppConstant.SALESMAN_RECOVERY_DELETE) {
      this.message = `Do you want to delete record for  SALESMAN: ${
        this.data.object.salesman
      } , FROM DATE : ${this.data.object.fromDate
        .toDate()
        .toDateString()}  , TO DATE : ${this.data.object.toDate
        .toDate()
        .toDateString()} `;
    } else if (this.data.key === AppConstant.SALESMAN_RECOVERY_UPDATE) {
      this.message = `Do you want to update record for  SALESMAN: ${
        this.data.object.salesman
      } , FROM DATE : ${this.data.object.fromDate
        .toDate()
        .toDateString()}  , TO DATE : ${this.data.object.toDate
        .toDate()
        .toDateString()} `;
    } else if (this.data.key === AppConstant.USER_DELETE) {
      this.message = `Do you want to delete this user : ${this.data.object.username}`;
    } else if (this.data.key === AppConstant.USER_UPDATE) {
      this.message = `Do you want to update this user : ${this.data.object.username}`;
    }
  }

  onYesClick(): void {
    this.data.delete = AppConstant.YES_ACTION;
    this.dialogRef.close(this.data);
  }

  onNoClick(): void {
    this.data.delete = AppConstant.NO_ACTION;
    this.dialogRef.close(this.data);
  }
}
