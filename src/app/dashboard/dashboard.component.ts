import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RecoveryService } from '../services/recovery.service';
import { ModeWiseRecovery, RecoveryDetails } from '../models/route';
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
  recoveryModeWiseCollection: ModeWiseRecovery[] = [];

  displayedColumns: string[] = [
    'storeName',
    'salesman',
    'billNo',
    'recoveryDate',
    'receiptNo',
    'paymentmode',
    'recoveryAmount',
  ];

  recoveryModeWisedisplayedColumns: string[] = ['paymentMode', 'amount'];

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
    this.recoveryCollection = [];
    this.recoveryModeWiseCollection = [];

    this.recoveryService
      .getRecoveryDetails('', this.fromDate.value, this.toDate.value)
      .then((result) => {
        this.recoveryCollection = this.sortData(result);
        this.recoveryModeWiseCollection = this.GroupBy1(result);
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

  GroupBy1(arr: RecoveryDetails[]) {
    let groupedList: ModeWiseRecovery[] = [];
    let paymentMode = arr.map((p) => p.modeOfPayment);

    paymentMode.forEach((pay) => {
      if (!groupedList.find((c) => c.paymentMode == pay)) {
        let records = arr.filter((c) => c.modeOfPayment == pay);

        let sum = records.reduce((prev, next) => {
          return (prev += +next.amountReceived);
        }, 0);

        groupedList.push({
          paymentMode: pay,
          amount: sum,
        });
      }
    });

    return groupedList;
  }

  getTotalAmountReceived() {
    return this.recoveryCollection
      .map((t) => {
        return +t.amountReceived;
      })
      .reduce((acc, value) => acc + value, 0);
  }

  getTotalModeWiseAmountReceived() {
    return this.recoveryModeWiseCollection
      .map((t) => {
        return +t.amount;
      })
      .reduce((acc, value) => acc + value, 0);
  }
}
