import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { RecoveryService } from '../services/recovery.service';
import { ModeWiseRecovery, RecoveryDetails } from '../models/route';
import { UserService } from '../services/user.service';
import { PaymentModeService } from '../services/paymentMode.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  fromDate!: UntypedFormControl;
  toDate!: UntypedFormControl;
  salesmanSelected!: UntypedFormControl;
  paymentModeSelected!: UntypedFormControl;

  recoveryFixedCollection: RecoveryDetails[] = [];
  recoveryCollection: RecoveryDetails[] = [];
  recoveryModeWiseCollection: ModeWiseRecovery[] = [];
  salesmanCollection: string[] = [];
  paymentModeCollection: string[] = [];

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

  constructor(
    private recoveryService: RecoveryService,
    private userService: UserService,
    private paymentModeService: PaymentModeService
  ) {}

  ngOnInit(): void {
    this.fromDate = new UntypedFormControl(new Date());
    this.toDate = new UntypedFormControl(new Date());
    this.salesmanSelected = new UntypedFormControl('ALL');
    this.getSalesmanDetail();
    this.paymentModeSelected = new UntypedFormControl('ALL');
    this.getPaymentModes();
    this.onfetchRecoveryDetails();
  }

  onfetchRecoveryDetails() {
    if (!this.fromDate || !this.fromDate) {
      console.log('error in form');
      return;
    }
    this.recoveryCollection = [];
    this.recoveryModeWiseCollection = [];

    this.fromDate.value.setHours(0, 0, 0, 0);
    this.toDate.value.setHours(23, 59, 59, 0);

    this.recoveryService
      .getRecoveryDetails('', this.fromDate.value, this.toDate.value)
      .then((result) => {
        this.recoveryFixedCollection = this.sortData(result);
        this.onSelectionChange();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  sortData(result: RecoveryDetails[]) {
    return result.sort((a, b) => {
      return <any>a.recoveryDate - <any>b.recoveryDate;
    });
  }

  GroupByPaymentMode(arr: RecoveryDetails[]) {
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

  getSalesmanDetail() {
    this.salesmanCollection = [];
    this.userService
      .getSalesmanList()
      .then((records) => {
        if (records && records.length > 0) {
          let salesman = records.filter((c) => c.role == 'salesman');

          this.salesmanCollection.push('ALL');
          salesman.forEach((item) =>
            this.salesmanCollection.push(item.username)
          );
        }
      })
      .catch(() => {});
  }

  getPaymentModes() {
    this.paymentModeCollection = [];
    this.paymentModeService
      .getPaymentModeList()
      .then((records) => {
        if (records && records.length > 0) {
          this.paymentModeCollection.push('ALL');
          records.forEach((item) => this.paymentModeCollection.push(item.mode));
        }
      })
      .catch(() => {});
  }

  onSelectionChange() {
    this.filterData();
  }

  filterData() {
    let result: RecoveryDetails[] = [];

    if (this.salesmanSelected.value == 'ALL') {
      result = this.recoveryFixedCollection;
    } else {
      result = this.recoveryFixedCollection.filter(
        (c) => c.recoveryAgent == this.salesmanSelected.value
      );
    }

    if (
      this.paymentModeSelected.value &&
      this.paymentModeSelected.value != 'ALL'
    ) {
      result = result.filter(
        (c) => c.modeOfPayment == this.paymentModeSelected.value
      );
    }

    this.recoveryCollection = this.sortData(result);
    this.recoveryModeWiseCollection = this.GroupByPaymentMode(result);
  }
}
