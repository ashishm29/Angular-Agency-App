import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import {
  CompanyDetail,
  Order,
  ProductDetail,
  Route,
  StoreDetails,
  itemDetail,
  orderStatus,
} from '../models/route';
import { Observable, map, startWith } from 'rxjs';
import { RouteService } from '../services/route.service';
import { BillService } from '../services/bill.service';
import { StoreService } from '../services/store.service';
import { LocalStorageService } from '../services/local-storage.service';
import { AppConstant } from '../appConstant';
import { ColDef } from 'ag-grid-community';
import { DatePipe } from '@angular/common';
import { SnackBarService } from '../services/snackbar.service';
import { OrderService } from '../services/order.service';
import { ButtonRendererComponent } from '../renderer/button-renderer/button-renderer.component';
import { ProductService } from '../services/product.service';
import { BaseCompany } from '../abstract/baseCompany';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent extends BaseCompany implements OnInit {
  paidUnpaidSelection!: UntypedFormControl;
  routeCollection: Route[] = [];
  storeCollection: StoreDetails[] = [];
  filteredOptions: Observable<StoreDetails[]> | undefined;
  selectedStore!: StoreDetails | null;
  item!: FormControl;
  orderId!: string | null;
  companyNameFormControl!: UntypedFormControl;
  productNameFormControl!: UntypedFormControl;

  headerFormGroup!: UntypedFormGroup;

  order: Order = new Order();
  collection: itemDetail[] = [];
  frameworkComponents: any;
  api!: any;
  gridOptions = {
    suppressRowHoverHighlight: false,
    columnHoverHighlight: false,
    pagination: false,
    paginationPageSize: 50,
    suppressHorizontalScroll: false,
    alwaysShowHorizontalScroll: true,
  };

  public defaultColDef: ColDef = {
    editable: false,
    filter: true,
  };

  colDefs: ColDef[] = [
    {
      field: 'companyName',
      flex: 2,
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
      editable: true,
    },
    {
      field: 'productName',
      flex: 2,
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
      editable: true,
    },
    {
      headerName: 'Delete',
      minWidth: 100,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.onDelete.bind(this),
        label: 'Delete',
      },
    },
  ];

  onGridReady(params: any) {
    this.api = params.api;
  }

  constructor(
    public routeService: RouteService,
    public billService: BillService,
    public storeService: StoreService,
    private datePipe: DatePipe,
    private snackbarService: SnackBarService,
    private orderService: OrderService,
    productService: ProductService
  ) {
    super(productService);
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    };
  }

  ngOnInit(): void {
    this.item = new FormControl();
    this.headerFormGroup = new UntypedFormGroup({
      route: new UntypedFormControl(),
      storeName: new UntypedFormControl(),
      mobileNumber: new UntypedFormControl(),
      address: new UntypedFormControl(),
    });

    this.companyNameFormControl = new UntypedFormControl();
    this.productNameFormControl = new UntypedFormControl();

    this.onFetchRoute();
    this.onFetchCompanys();
  }

  onRouteSelectionChange(selectedRoute: string) {
    console.log(selectedRoute);
    this.headerFormGroup.patchValue({
      mobileNumber: '',
      address: '',
      storeName: '',
    });
    this.onFetchStoreDetails(selectedRoute);
    this.collection = [];
    this.updateGrid();
    this.selectedStore = null;
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
    this.storeService.getStores(selecetdValue).then((result) => {
      if (result && result.length > 0) {
        this.storeCollection = result;
      } else {
        console.log(AppConstant.STORE_NOT_FOUND_MSG);
      }
      this.subscribeStoreNameValueChange();
    });
  }

  onStoreSelected(selectedStore: StoreDetails) {
    this.selectedStore = selectedStore;
    this.headerFormGroup.patchValue({
      mobileNumber: selectedStore.mobileNo,
      address: selectedStore.address,
    });

    this.collection = [];
    this.updateGrid();
  }

  subscribeStoreNameValueChange() {
    let routeControl = this.headerFormGroup.controls['storeName'];
    this.filteredOptions = routeControl?.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name
          ? this._filter(name as string)
          : this.storeCollection.slice();
      })
    );
  }

  private _filter(name: string): StoreDetails[] {
    const filterValue = name.toLowerCase();

    return this.storeCollection.filter((option) =>
      option.storeName.toLowerCase().includes(filterValue)
    );
  }

  displayFn(user: StoreDetails): string {
    return user && user.storeName ? user.storeName : '';
  }

  generateOrderId(): string {
    if (this.orderId) {
      return this.orderId;
    }

    let currDate = new Date();
    this.orderId = this.datePipe.transform(currDate, 'MMddyyyyHHmmss');
    return this.orderId as string;
  }

  onAddItem() {
    if (!this.selectedStore) {
      this.snackbarService.openSnackBar(
        AppConstant.PLEASE_SELECT_STORE,
        AppConstant.ADD_ACTION
      );
    }

    if (this.selectedStore) {
      let currDate = new Date();

      if (this.order) {
        this.order.orderId = this.generateOrderId();
        this.order.store = this.selectedStore;
        this.order.createdDate = this.datePipe.transform(
          currDate,
          'MM/dd/yyyy HH-mm-ss'
        ) as unknown as Date;
      }
      this.collection.push({
        productId: this.productNameFormControl.value.productId,
        productName: this.productNameFormControl.value.productName,
        companyId: this.companyNameFormControl.value.companyId,
        companyName: this.companyNameFormControl.value.companyName,
      });
      this.updateGrid();
      this.item.reset();
    }
  }

  updateGrid() {
    this.api.updateGridOptions({ rowData: this.collection });
  }

  onSaveOrder() {
    if (this.order) {
      this.order.items = this.collection;
      this.order.orderStatus = orderStatus.NEW;

      this.orderService
        .add(this.order)
        .then(() => {
          this.snackbarService.openSnackBar(
            AppConstant.ORDER_ADDED_SUCCESS_MSG,
            AppConstant.SAVE_ACTION
          );
          this.item.reset();
          this.order = new Order();
          this.collection = [];
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  onDelete(record: any) {
    let element = record.rowData;
    let index = this.collection.indexOf(element);
    this.collection.splice(index, 1);
    let array = this.collection.slice();
    this.collection = array;
    this.api.updateGridOptions({ rowData: this.collection });
  }
}
