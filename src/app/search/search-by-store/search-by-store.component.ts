import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { AppConstant } from 'src/app/appConstant';
import { BillDetails, Route, StoreDetails } from 'src/app/models/route';
import { BillService } from 'src/app/services/bill.service';
import { DataEntryService } from 'src/app/services/data-entry.service';

@Component({
  selector: 'app-search-by-store',
  templateUrl: './search-by-store.component.html',
  styleUrls: ['./search-by-store.component.scss'],
})
export class SearchByStoreComponent implements OnInit {
  routeCollection: Route[] = [];
  storeCollection: StoreDetails[] = [];
  filteredOptions: Observable<StoreDetails[]> | undefined;
  billCollection: BillDetails[] = [];
  displayedColumns: string[] = [
    'route',
    'storeName',
    'billDate',
    'billNumber',
    'billAmount',
    'pendingAmount',
  ];

  route!: FormControl;
  storeName!: FormControl;
  fromBillDate!: FormControl;
  toBillDate!: FormControl;
  storeMessage!: string;
  billMessage!: string;

  constructor(
    public entryService: DataEntryService,
    public billService: BillService
  ) {}

  ngOnInit(): void {
    this.route = new FormControl();
    this.storeName = new FormControl();
    this.fromBillDate = new FormControl();
    this.toBillDate = new FormControl();
    this.onFetchRoute();
  }

  onRouteSelectionChange(selectedRoute: string) {
    console.log(selectedRoute);
    this.storeName.setValue('');
    this.billCollection = [];
    this.storeMessage;
    this.billMessage = '';
    this.onFetchStoreDetails(selectedRoute);
  }

  onFetchRoute() {
    this.routeCollection = [];

    this.entryService.getRoutes().then((result) => {
      if (result && result.length > 0) {
        this.routeCollection = result;
      } else {
        console.log(AppConstant.ROUTE_NOT_FOUND_MSG);
      }
    });
  }

  onFetchStoreDetails(selecetdValue: string) {
    this.storeCollection = [];
    this.storeMessage;
    this.entryService.getStores(selecetdValue).then((result) => {
      if (result && result.length > 0) {
        this.storeCollection = result;
      } else {
        console.log(AppConstant.STORE_NOT_FOUND_MSG);
      }
      this.storeMessage = 'STORES  : ' + this.storeCollection?.length;
      this.subscribeStoreNameValueChange();
    });
  }

  onStoreSelected(selectedStore: StoreDetails) {}

  subscribeStoreNameValueChange() {
    this.filteredOptions = this.storeName.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name
          ? this._filter(name as string)
          : this.storeCollection.slice();
      })
    );
  }

  displayFn(user: StoreDetails): string {
    return user && user.storeName ? user.storeName : '';
  }

  private _filter(name: string): StoreDetails[] {
    const filterValue = name.toLowerCase();

    return this.storeCollection.filter((option) =>
      option.storeName.toLowerCase().includes(filterValue)
    );
  }

  onSearch() {
    this.billCollection = [];
    this.billService
      .getFilteredBills(
        this.route?.value,
        this.storeName?.value?.storeName,
        this.fromBillDate?.value?.toLocaleDateString(),
        this.toBillDate?.value?.toLocaleDateString()
      )
      .then((result) => {
        if (result && result.length > 0) {
          this.billCollection = this.sortData(result);
        } else {
          console.log(AppConstant.STORE_NOT_FOUND_MSG);
        }
        this.billMessage = 'BILLS  : ' + this.billCollection?.length;
      });
  }

  sortData(result: BillDetails[]) {
    return result
      .sort((a, b) => {
        return <any>a.billNumber - <any>b.billNumber;
      })
      .sort((a, b) => {
        return <any>new Date(a.billDate) - <any>new Date(b.billDate);
      });

    // .sort((a, b) => {
    //   return a.route < b.route ? -1 : 1;
    // });
  }

  getTotalBillAmount() {
    return this.billCollection
      .map((t) => +t.billAmount)
      .reduce((acc, value) => acc + value, 0);
  }

  getTotalPendingAmount() {
    return this.billCollection
      .map((t) => +t.pendingAmount)
      .reduce((acc, value) => acc + value, 0);
  }
}
