export class Route {
  routeName!: string;
  id!: string;
  createdDate!: string;
}

export class StoreDetails {
  id!: string;
  route!: string;
  storeName!: string;
  address!: string;
  mobileNo!: string;
  altMobileNo!: string;
  createdDate!: string;
}

export class BillDetails {
  route!: string;
  storeName!: string;
  billNumber!: string;
  billDate!: Date;
  billAmount!: string;
  createdDate!: string;
}

export class Recovery {
  route!: Route;
  shopDetails!: StoreDetails;
  billDetails!: BillDetails;
  createdDate!: string;
}

export class StoreDataEntry {
  route!: Route;
  shopDetails!: StoreDetails;
}
