export class Route {
  routeName!: string;
  id!: string;
  createdDate!: Date;
}

export class StoreDetails {
  id!: string;
  route!: string;
  storeName!: string;
  address!: string;
  mobileNo!: string;
  altMobileNo!: string;
  createdDate!: Date;
}

export class BillDetails {
  route!: string;
  storeName!: string;
  billNumber!: string;
  billDate!: Date;
  billAmount!: string;
  createdDate!: Date;
}

export class Recovery {
  route!: Route;
  shopDetails!: StoreDetails;
  billDetails!: BillDetails;
  createdDate!: Date;
}

export class StoreDataEntry {
  route!: Route;
  shopDetails!: StoreDetails;
}
