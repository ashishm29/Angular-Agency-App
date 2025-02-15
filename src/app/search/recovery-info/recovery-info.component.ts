import { Component, OnInit, Inject } from '@angular/core';
import { RecoveryDetails } from 'src/app/models/route';
import { RecoveryService } from 'src/app/services/recovery.service';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { dateConverter } from 'src/app/shared/dateConverter';

@Component({
  selector: 'app-recovery-info',
  templateUrl: './recovery-info.component.html',
  styleUrls: ['./recovery-info.component.scss'],
})
export class RecoveryInfoComponent implements OnInit {
  selectedBillNumber!: string;
  recoveryCollection: RecoveryDetails[] = [];

  displayedColumns: string[] = [
    'billNumber',
    'recoveryAgent',
    'billAmount',
    'recoveryDate',
    'receiptNumber',
    'amountReceived',
    'pendingAmount',
    'modeOfPayment',
    'chequeNo',
  ];

  constructor(
    public dialogRef: MatDialogRef<RecoveryInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { billNumber: '' },
    private recoveryService: RecoveryService
  ) {}

  ngOnInit(): void {
    this.dialogRef.updateSize('100%');
    this.getBillDetails();
  }

  getBillDetails() {
    this.recoveryService
      .getRecoveryDetails(this.data.billNumber)
      .then((result) => {
        this.recoveryCollection = this.sortData(result);
      });
  }

  sortData(result: RecoveryDetails[]) {
    return result.sort((a, b) => {
      return (
        <any>dateConverter.StringToDateTimeConverter(a.createdDate) -
        <any>dateConverter.StringToDateTimeConverter(b.createdDate)
      );
    });
  }
}
