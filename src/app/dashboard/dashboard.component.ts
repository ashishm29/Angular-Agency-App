import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RecoveryService } from '../services/recovery.service';
import { RecoveryDetails } from '../models/route';
import { dateConverter } from '../shared/dateConverter';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  fromDate!: FormControl;
  toDate!: FormControl;
  recoveryCollection: RecoveryDetails[] = [];

  displayedColumns: string[] = [
    'storeName',
    'salesman',
    'billNo',
    'recoveryDate',
    'receiptNo',
    'paymentmode',
    'recoveryAmount',
  ];

  constructor(private recoveryService: RecoveryService) {}

  ngOnInit(): void {
    let todaysDate = new Date();
    todaysDate.setHours(0, 0, 0, 0);
    this.fromDate = new FormControl(todaysDate);
    let to = new Date();
    to.setHours(23, 59, 59, 0);
    this.toDate = new FormControl(to);
  }

  onfetchRecoveryDetails() {
    if (!this.fromDate || !this.fromDate) {
      console.log('error in form');
      return;
    }

    this.recoveryService
      .getRecoveryDetails('', this.fromDate.value, this.toDate.value)
      .then((result) => {
        this.recoveryCollection = this.sortData(result);
      })
      .catch((err) => {
        console.log(err);
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

  getTotalAmountReceived() {
    return this.recoveryCollection
      .map((t) => {
        return +t.amountReceived;
      })
      .reduce((acc, value) => acc + value, 0);
  }
}
