import { Timestamp } from '@angular/fire/firestore';

export class Route {
  routeName!: string;
  id!: string;
  createdDate!: string;
  updatedDate!: string;
}

export class StoreDetails {
  id!: string;
  route!: string;
  storeName!: string;
  address!: string;
  mobileNo!: string;
  altMobileNo!: string;
  createdDate!: string;
  updatedDate!: string;
}

export class BillDetails {
  id!: string;
  route!: string;
  storeName!: StoreDetails;
  billNumber!: string;
  billDate!: Timestamp;
  billAmount!: string;
  pendingAmount!: string;
  createdDate!: string;
  updatedDate!: string;
  comment!: string;
  isRedBill!: boolean;
  isOrangeBill!: boolean;
}

export class RecoveryDetails {
  id!: string;
  route!: string;
  storeName!: StoreDetails;
  address!: string;
  billNumber!: string;
  billAmount!: string;
  amountReceived!: string;
  pendingAmount!: string;
  receiptNumber!: string;
  modeOfPayment!: string;
  recoveryDate!: Date;
  createdDate!: string;
  recoveryAgent!: string;
}

export class StoreDataEntry {
  route!: Route;
  shopDetails!: StoreDetails;
}

export class PaymentMode {
  mode!: string;
  id!: string;
}

export class ModeWiseRecovery {
  paymentMode!: string;
  amount!: number;
}

export class Attendance {
  id!: string;
  createdDate!: Date;
  salesman!: string;
  absentDate!: Timestamp;
  absentDayList!: string[];
  totalAbsentDays!: number;
  salary!: number;
  paidAmount!: number;
  salaryToPay!: number;
  comment!: string;
}

export class Expense {
  id!: string;
  createdDate!: Date;
  reason!: string;
  comment!: string;
  amount!: number;
}
