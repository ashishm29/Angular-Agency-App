import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { AppConstant } from 'src/app/appConstant';
import { BillDetails, Route, StoreDetails } from 'src/app/models/route';
import { BillService } from 'src/app/services/bill.service';
import { RecoveryInfoComponent } from '../recovery-info/recovery-info.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { DeleteConfirmationDialogComponent } from 'src/app/dialog/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { RouteService } from 'src/app/services/route.service';
import { StoreService } from 'src/app/services/store.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { dateConverter } from 'src/app/shared/dateConverter';
import { ExcelService } from 'src/app/services/excel.service';
import { DatePipe } from '@angular/common';
import { LocalStorageService } from 'src/app/services/local-storage.service';

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
    'address',
    'billDate',
    'billNumber',
    'billAmount',
    'amountReceived',
    'pendingAmount',
    'Action',
  ];

  route!: UntypedFormControl;
  paidUnpaidSelection!: UntypedFormControl;
  storeName!: UntypedFormControl;
  billNumber!: UntypedFormControl;
  fromBillDate!: UntypedFormControl;
  toBillDate!: UntypedFormControl;
  storeMessage!: string;
  billMessage!: string;
  isAdmin!: boolean;
  selectedRowIndex = -1;

  constructor(
    public routeService: RouteService,
    public billService: BillService,
    public storeService: StoreService,
    private snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService,
    private snackbarService: SnackBarService,
    private excelService: ExcelService,
    private datePipe: DatePipe,
    private localstorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.initFormFields();
    this.onFetchRoute();
    //this.authService.IfNotExistCreateNewCollections();
    this.onSearch();
  }

  initFormFields() {
    let paidUnpaid = this.localstorageService.getKeyValue(
      AppConstant.PAID_SEARCH_LOCAL_STORAGE_KEY
    );

    let route = this.localstorageService.getKeyValue(
      AppConstant.ROUTE_LOCAL_STORAGE_KEY
    );
    if (route) {
      this.onFetchStoreDetails(route);
    }

    let store = this.localstorageService.getKeyValue(
      AppConstant.STORE_SEARCH_LOCAL_STORAGE_KEY
    ) as string;

    let storeDetail = JSON.parse(store) as StoreDetails;

    let billNumber = this.localstorageService.getKeyValue(
      AppConstant.BILL_SEARCH_LOCAL_STORAGE_KEY
    );

    let localFromDate = this.localstorageService.getKeyValue(
      AppConstant.FROM_DATE_SEARCH_LOCAL_STORAGE_KEY
    ) as string;

    let localToDate = this.localstorageService.getKeyValue(
      AppConstant.TO_DATE_SEARCH_LOCAL_STORAGE_KEY
    ) as string;

    let fromdate = new Date();
    fromdate.setDate(fromdate.getDate() - 30);

    let convertLocalFromdate = localFromDate ? new Date(localFromDate) : null;
    let convertLocalTodate = localToDate ? new Date(localToDate) : null;

    this.route = new UntypedFormControl(route);
    this.paidUnpaidSelection = new UntypedFormControl(paidUnpaid ?? 'UnPaid');
    this.storeName = new UntypedFormControl(storeDetail);
    this.billNumber = new UntypedFormControl(billNumber);
    this.fromBillDate = new UntypedFormControl(convertLocalFromdate ?? null);
    this.toBillDate = new UntypedFormControl(convertLocalTodate ?? null);
    this.storeMessage;
    this.billMessage = '';
  }

  highlight(row: any) {
    this.selectedRowIndex = row.id;
  }

  onRouteSelectionChange(selectedRoute: string) {
    console.log(selectedRoute);
    this.storeName.setValue('');
    this.billNumber.setValue('');
    this.billCollection = [];
    this.storeMessage;
    this.billMessage = '';
    this.onFetchStoreDetails(selectedRoute);
  }

  onPaidUnpaidSelectionChange(selectedRoute: string) {
    this.billMessage = '';
    this.onSearch();
  }

  onFetchRoute() {
    this.routeCollection = [];

    this.routeService.getRoutes().then((result) => {
      if (result && result.length > 0) {
        this.routeCollection = this.sortRouteData(result);
      } else {
        console.log(AppConstant.ROUTE_NOT_FOUND_MSG);
      }
    });
  }

  sortRouteData(result: Route[]) {
    return result.sort((a, b) => {
      return a.routeName < b.routeName ? -1 : 1;
    });
  }

  onFetchStoreDetails(selecetdValue: string) {
    this.storeCollection = [];
    this.storeMessage;
    this.storeService.getStores(selecetdValue).then((result) => {
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

  onReset() {
    this.localstorageService.removeKey(
      AppConstant.PAID_SEARCH_LOCAL_STORAGE_KEY
    );

    this.localstorageService.removeKey(AppConstant.ROUTE_LOCAL_STORAGE_KEY);

    this.localstorageService.removeKey(
      AppConstant.STORE_SEARCH_LOCAL_STORAGE_KEY
    );

    this.localstorageService.removeKey(
      AppConstant.BILL_SEARCH_LOCAL_STORAGE_KEY
    );

    this.localstorageService.removeKey(
      AppConstant.FROM_DATE_SEARCH_LOCAL_STORAGE_KEY
    );

    this.localstorageService.removeKey(
      AppConstant.TO_DATE_SEARCH_LOCAL_STORAGE_KEY
    );

    this.initFormFields();
    this.billCollection = [];
    this.selectedRowIndex = -1;
  }

  onSearch() {
    this.billCollection = [];
    this.selectedRowIndex = -1;
    this.billMessage = '';

    let fromDate = this.fromBillDate.value;
    let toDate = this.toBillDate.value;

    if (this.fromBillDate.value) {
      fromDate = this.fromBillDate.value as Date;
      fromDate.setHours(0, 0, 0);

      if (this.toBillDate.value) {
        let toDate = this.toBillDate.value as Date;
        toDate.setHours(23, 59, 59);
      } else {
        let toDate = this.fromBillDate.value as Date;
        toDate.setHours(23, 59, 59);
      }
    }

    if (this.paidUnpaidSelection) {
      this.localstorageService.setKeyValue(
        AppConstant.PAID_SEARCH_LOCAL_STORAGE_KEY,
        this.paidUnpaidSelection.value
      );
    }

    if (this.route?.value) {
      this.localstorageService.setKeyValue(
        AppConstant.ROUTE_LOCAL_STORAGE_KEY,
        this.route?.value
      );
    } else {
      this.localstorageService.removeKey(AppConstant.ROUTE_LOCAL_STORAGE_KEY);
    }

    if (this.storeName?.value) {
      this.localstorageService.setKeyValue(
        AppConstant.STORE_SEARCH_LOCAL_STORAGE_KEY,
        JSON.stringify(this.storeName.value)
      );
    } else {
      this.localstorageService.removeKey(
        AppConstant.STORE_SEARCH_LOCAL_STORAGE_KEY
      );
    }

    if (fromDate) {
      this.localstorageService.setKeyValue(
        AppConstant.FROM_DATE_SEARCH_LOCAL_STORAGE_KEY,
        fromDate
      );
    } else {
      this.localstorageService.removeKey(
        AppConstant.FROM_DATE_SEARCH_LOCAL_STORAGE_KEY
      );
    }

    if (toDate) {
      this.localstorageService.setKeyValue(
        AppConstant.TO_DATE_SEARCH_LOCAL_STORAGE_KEY,
        toDate
      );
    } else {
      this.localstorageService.removeKey(
        AppConstant.TO_DATE_SEARCH_LOCAL_STORAGE_KEY
      );
    }

    if (this.billNumber?.value) {
      this.localstorageService.setKeyValue(
        AppConstant.BILL_SEARCH_LOCAL_STORAGE_KEY,
        this.billNumber.value
      );
    } else {
      this.localstorageService.removeKey(
        AppConstant.BILL_SEARCH_LOCAL_STORAGE_KEY
      );
    }

    this.billService
      .getFilteredBills(
        this.route?.value,
        this.storeName?.value?.storeName,
        fromDate,
        toDate,
        this.billNumber.value,
        this.paidUnpaidSelection
      )
      .then((result) => {
        if (result && result.length > 0) {
          let filterResult = result;
          if (this.paidUnpaidSelection) {
            if (this.paidUnpaidSelection.value === 'UnPaid') {
              filterResult = result.filter((c) => +c.pendingAmount > 0);
            } else if (this.paidUnpaidSelection.value === 'Paid') {
              filterResult = result.filter((c) => +c.pendingAmount == 0);
            }
          }

          let oldRedBills = this.getRedBills(filterResult);
          let oldOrangeBills = this.getOrangeBills(filterResult);
          let soredBills = this.sortData(
            filterResult.filter((c) => !c.isRedBill && !c.isOrangeBill)
          );

          let totalBills: BillDetails[] = [];
          totalBills.push(...oldRedBills);
          totalBills.push(...oldOrangeBills);
          totalBills.push(...soredBills);
          this.billCollection = totalBills;
        } else {
          console.log(AppConstant.STORE_NOT_FOUND_MSG);
        }
        this.billMessage = 'BILLS  : ' + this.billCollection?.length;
      })
      .catch((err) => {
        console.log(err);
        this.snackbarService.openSnackBar(err, AppConstant.ERROR_ACTION);
      });
  }

  sortData(result: BillDetails[]) {
    return result.sort((a, b) => {
      try {
        if (a.storeName.storeName === b.storeName.storeName) {
          return <any>a.billDate.toDate() - <any>b.billDate.toDate();
        } else {
          return a.storeName.storeName < b.storeName.storeName ? -1 : 1;
        }
      } catch {
        return 0;
      }
    });
  }

  getBillDate(element: BillDetails) {
    try {
      return this.datePipe.transform(element.billDate.toDate(), 'dd-MM-yyyy');
    } catch {
      return element.billDate;
    }
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

  getTotalAmountReceived() {
    return this.billCollection
      .map((t) => +t.billAmount - +t.pendingAmount)
      .reduce((acc, value) => acc + value, 0);
  }

  onDeleteBill(element: BillDetails) {
    console.log(element.id);
    this.billService
      .deleteBill(element.id)
      .then(() => {
        this.snackbarService.openSnackBar(
          AppConstant.BILL_DELETED_SUCCESS_MSG,
          AppConstant.DELETE_ACTION
        );
        console.log(AppConstant.BILL_DELETED_SUCCESS_MSG);
        this.onSearch();
      })
      .catch((err) => {
        console.log(err);
        this.snackbarService.openSnackBar(err, AppConstant.ERROR_ACTION);
      });
  }

  navigateToBillDetailPage(billNumber: string) {
    this.router.navigate(['billinfo/' + billNumber]);
  }

  openDialog(selectedBillNo: string): void {
    const dialogRef = this.dialog.open(RecoveryInfoComponent, {
      data: { billNumber: selectedBillNo },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  openDeleteConfimationDialog(element: BillDetails): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { billNumber: element.billNumber },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.delete == AppConstant.YES_ACTION) {
        console.log(AppConstant.YES_ACTION);
        this.onDeleteBill(element);
      } else {
        console.log(AppConstant.NO_ACTION);
      }
    });
  }

  exportToExcel() {
    this.excelService.ExportBillReportExcel(
      this.billCollection,
      this.fromBillDate?.value?.toLocaleDateString(),
      this.toBillDate?.value?.toLocaleDateString()
    );
  }

  getRedBills(bills: BillDetails[]): BillDetails[] {
    var deallineDate = new Date();
    deallineDate.setDate(deallineDate.getDate() - 12);

    bills
      .filter((item) => +item.pendingAmount > 0)
      .forEach((item) => {
        try {
          if (deallineDate > item.billDate.toDate()) {
            item.isRedBill = true;
          } else {
            item.isRedBill = false;
          }
        } catch {
          item.isRedBill = true;
        }
      });

    return bills.filter((item) => item.isRedBill);
  }

  getOrangeBills(bills: BillDetails[]): BillDetails[] {
    var deallineStartDate = new Date();
    var deallineEndDate = new Date();
    deallineStartDate.setDate(deallineStartDate.getDate() - 5);
    deallineEndDate.setDate(deallineEndDate.getDate() - 12);

    bills
      .filter((item) => +item.pendingAmount > 0)
      .forEach((item) => {
        try {
          if (
            deallineStartDate > item.billDate.toDate() &&
            deallineEndDate < item.billDate.toDate()
          ) {
            item.isOrangeBill = true;
          } else {
            item.isOrangeBill = false;
          }
        } catch {
          item.isOrangeBill = false;
        }
      });

    return bills.filter((item) => item.isOrangeBill);
  }

  getRowClass(row: any) {
    if (row.pendingAmount == 0) {
      if (this.selectedRowIndex == row.id) {
        return 'selected-row-highlight';
      } else {
        return 'full-paid-bill-row-highlight';
      }
    } else if (row.isRedBill) {
      if (this.selectedRowIndex == row.id) {
        return 'selected-row-highlight';
      } else {
        return 'older-red-bill-row-selected-highlight';
      }
    } else if (row.isOrangeBill) {
      if (this.selectedRowIndex == row.id) {
        return 'selected-row-highlight';
      } else {
        return 'older-orange-bill-row-selected-highlight';
      }
    } else {
      if (this.selectedRowIndex == row.id) {
        return 'selected-row-highlight';
      } else {
        if (row.billAmount !== row.pendingAmount) {
          return 'partial-paid-bill-row-selected-highlight';
        }
        return '';
      }
    }
  }
}
