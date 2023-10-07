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
  storeName!: string;
  billNumber!: string;
  billDate!: string;
  billAmount!: string;
  pendingAmount!: string;
  createdDate!: string;
  updatedDate!: string;
}

export class RecoveryDetails {
  id!: string;
  route!: string;
  storeName!: string;
  address!: string;
  billNumber!: string;
  billAmount!: string;
  amountReceived!: string;
  pendingAmount!: string;
  receiptNumber!: string;
  modeOfPayment!: string;
  createdDate!: string;
}

export class StoreDataEntry {
  route!: Route;
  shopDetails!: StoreDetails;
}

export class PaymentMode {
  mode!: string;
  id!: string;
}
