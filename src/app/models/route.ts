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
  status!: string;
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
  isDeposite!: string;
  depositeStatus!: string;
  chequeNo!: string;
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

export class RecoveryHistory {
  id!: string;
  salesman!: string;
  createdDate!: Date;
  fromDate!: Date;
  toDate!: Date;
  totalAmount!: number;
  receivedAmount!: number;
  pendingAmount!: number;
}

export class Order {
  orderId!: string;
  store!: StoreDetails;
  createdDate!: Date;
  items!: itemDetail[];
  orderStatus!: orderStatus;
}

export class itemDetail {
  productName!: string;
  productId!: string;
  companyId!: string;
  companyName!: string;
}

export class ProductDetail {
  id!: string;
  productId!: string;
  productName!: string;
  companyId!: string;
  companyName!: string;
}

export class CompanyDetail {
  id!: string;
  companyId!: string;
  companyName!: string;
}

export enum orderStatus {
  NEW = 0,
  IN_PROCESS = 1,
  DELIVERED = 2,
}

export enum PaymentStatus {
  PENDING = 0,
  PAID = 1,
}

export class Purchase {
  partyName!: string;
  billDate!: Timestamp;
  billNumber!: string;
  billAmount!: string;
  revisedAmount!: string;
  comment!: string;
  paymentDate!: Timestamp;
  paymentStatus!: string;
  id!: string;
  createdDate!: Timestamp;
}
