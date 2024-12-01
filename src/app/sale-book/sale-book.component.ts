import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  NgForm,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { AppConstant } from '../appConstant';
import { BillService } from '../services/bill.service';
import { LocalStorageService } from '../services/local-storage.service';
import { StoreRouteService } from '../interface/StoreRouteService';
import { MY_SERVICE_TOKEN } from '../app.module';
import { AgGridServiceImpl } from '../interfaceImplementation/AgGridServiceImpl';
import { ColDef } from 'ag-grid-community';
import { BillDetails, BillStatus } from '../models/route';
import { SnackBarService } from '../services/snackbar.service';
import { DatePipe } from '@angular/common';
import { ValidationDialogService } from '../services/validation-dialog.service';
import { map } from 'rxjs';
import { RecoveryService } from '../services/recovery.service';
import { CellStyle } from '@ag-grid-community/core';
import { MatDrawer } from '@angular/material/sidenav';
import { EditBillDetailsComponent } from '../edit-info/edit-bill-details/edit-bill-details.component';
import { RecoveryComponent } from '../recovery/recovery.component';

@Component({
  selector: 'app-sale-book',
  templateUrl: './sale-book.component.html',
  styleUrls: ['./sale-book.component.scss'],
})
export class SaleBookComponent extends AgGridServiceImpl implements OnInit {
  @ViewChild('billFormDirective') private billFormDirective!: NgForm;
  @ViewChild('drawer') private drawer!: MatDrawer;
  routeName!: string;
  myControl = new UntypedFormControl();
  isClicked: boolean = false;
  buttonText: string = AppConstant.ADD_BILL_BTN_TEXT;
  localRouteValue!: string;
  callbackFunction = new EventEmitter<{ action: string; value: any }>();
  showFiller = false;
  selectedAction!: string;

  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef })
  dynamicComponentContainer!: ViewContainerRef;

  constructor(
    public billService: BillService,
    private localStorageService: LocalStorageService,
    @Inject(MY_SERVICE_TOKEN) public storeRouteService: StoreRouteService,
    private datePipe: DatePipe,
    private snackbarService: SnackBarService,
    private validationDialogService: ValidationDialogService,
    public recoveryService: RecoveryService
  ) {
    super();
  }

  columns: ColDef[] = [
    {
      field: 'route',
      flex: 2,
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
    },
    {
      field: 'storeName',
      flex: 2,
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
      valueGetter: (params: any) => {
        return params.data.storeName.storeName;
      },
    },
    {
      field: 'billNumber',
      flex: 2,
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
    },
    {
      field: 'billDate',
      flex: 2,
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
      valueGetter: (param: any) => {
        try {
          return this.datePipe.transform(
            param.data.billDate.toDate(),
            'dd-MM-yyyy'
          );
        } catch {
          return this.datePipe.transform(
            param.data.billDate.toString(),
            'dd-MM-yyyy'
          );
        }
      },
    },
    {
      field: 'billAmount',
      flex: 2,
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
      editable: true,
    },
    {
      field: 'comment',
      flex: 2,
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
      editable: true,
    },
    {
      field: 'pendingAmount',
      flex: 2,
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
    },
    {
      minWidth: 80,
      width: 80,
      cellRenderer: 'agGridMenuRenderer',
      cellRendererParams: {
        callBack: this.callbackFunction,
      },
      cellStyle: (params: any) => {
        return params.data.pendingAmount === 0
          ? ({ 'pointer-events': 'none', opacity: '0.2' } as CellStyle)
          : ('' as unknown as CellStyle);
      },
    },
  ];

  ngOnInit(): void {
    this.initialize();
    this.collection = [];
    this.colDefs = this.columns;
    this.storeRouteService.onFetchRoute();
    this.loadNewStatusBills();

    this.recoveryService.recoveryUpdated
      .pipe(
        map(() => {
          this.loadNewStatusBills();
          this.drawer.toggle();
        })
      )
      .subscribe();

    this.billService.billUpdated
      .pipe(
        map(() => {
          this.loadNewStatusBills();
          this.drawer.toggle();
        })
      )
      .subscribe();

    if (this.localRouteValue) {
      this.storeRouteService.onRouteSelectionChange(this.localRouteValue);
    }

    this.callbackFunction
      .pipe(
        map((val) => {
          console.log(val.action);
          console.log(val.value);
          this.selectedAction = val.action;

          if (val.action === 'recovery') {
            this.openAddRecoveryPanel(val.value);
          } else if (val.action === 'deleteBill') {
            this.deleteBill(val.value);
          } else if (val.action === 'updateBill') {
            this.openUpdateBillPanel(val.value);
          } else if (val.action === 'markUnpaid') {
            this.markBillUnpaid(val.value);
          }
        })
      )
      .subscribe();
  }

  loadDependentComponent(component: any) {
    this.dynamicComponentContainer.clear();
    this.dynamicComponentContainer.createComponent(component);
  }

  initialize() {
    this.localRouteValue = this.localStorageService.getKeyValue(
      AppConstant.ROUTE_LOCAL_STORAGE_KEY
    ) as string;

    this.storeRouteService.billFormGroup = new UntypedFormGroup({
      route: new UntypedFormControl(this.localRouteValue, [
        Validators.required,
      ]),
      storeName: new UntypedFormControl('', [Validators.required]),
      billNumber: new UntypedFormControl('', [Validators.required]),
      billDate: new UntypedFormControl('', [Validators.required]),
      billAmount: new UntypedFormControl('', [Validators.required]),
      address: new UntypedFormControl(),
      comment: new UntypedFormControl(),
    });

    if (this.billFormDirective) {
      this.billFormDirective.resetForm();
    }

    this.storeRouteService.subscribeStoreNameValueChange();
  }

  onAddBill() {
    if (this.storeRouteService.billFormGroup.invalid) {
      console.log('bill form is invalid');
      return;
    }

    if (this.isClicked) {
      return;
    }

    this.isClicked = true;
    this.buttonText = AppConstant.PLEASE_WAIT_BTN_TEXT;

    let billDetails = {
      ...this.storeRouteService.billFormGroup.value,
      pendingAmount: this.storeRouteService.billFormGroup.value.billAmount,
      createdDate: this.datePipe.transform(
        Date.now().toString(),
        AppConstant.DATE_TIME_FORMAT
      ),
      status: BillStatus.NEW,
    } as BillDetails;

    this.billService
      .getFilteredBillsByBillNumber(billDetails.billNumber)
      .then((result) => {
        if (result != null && result.length > 0) {
          this.validationDialogService.openValidationDialog(
            AppConstant.ADD_BILL_VALIDATION
          );
          this.reset();
        } else {
          this.addBill(billDetails);
        }
      })
      .catch((err) => {
        console.log(err);
        this.snackbarService.openSnackBar(err, AppConstant.ERROR_ACTION);
        this.reset();
      });
  }

  addBill(billDetails: BillDetails) {
    this.billService
      .addBillDetails(billDetails)
      .then(() => {
        console.log(AppConstant.BILL_ADDED_SUCCESS_MSG);
        this.collection.push(billDetails);
        this.updateGrid();
        this.snackbarService.openSnackBar(
          AppConstant.BILL_ADDED_SUCCESS_MSG,
          AppConstant.SAVE_ACTION
        );
        this.reset();
      })
      .catch((err) => {
        console.log(err);
        this.snackbarService.openSnackBar(err, AppConstant.ERROR_ACTION);
        this.reset();
      });
  }

  reset() {
    this.isClicked = false;
    this.buttonText = AppConstant.ADD_BILL_BTN_TEXT;
    this.initialize();
    this.loadNewStatusBills();
  }

  loadNewStatusBills() {
    this.billService
      .getBillByStatus(BillStatus.NEW)
      .then((result) => {
        this.collection = [];
        if (result != null && result.length > 0) {
          this.collection = result;
        }
      })
      .catch((err) => {
        console.log(err);
        this.snackbarService.openSnackBar(err, AppConstant.ERROR_ACTION);
        this.reset();
      });
  }

  openAddRecoveryPanel(param: any) {
    this.loadDependentComponent(RecoveryComponent);
    this.recoveryService.parameters.emit({ params: param });
    this.drawer.toggle();
  }

  openUpdateBillPanel(param: any) {
    this.loadDependentComponent(EditBillDetailsComponent);
    this.billService.parameters.emit({ params: param });
    this.drawer.toggle();
  }

  deleteBill(param: any) {
    this.billService
      .deleteBill(param.id)
      .then(() => {
        this.snackbarService.openSnackBar(
          AppConstant.BILL_DELETED_SUCCESS_MSG,
          AppConstant.DELETE_ACTION
        );
        console.log(AppConstant.BILL_DELETED_SUCCESS_MSG);
      })
      .catch((err) => {
        console.log(err);
        this.snackbarService.openSnackBar(err, AppConstant.ERROR_ACTION);
      });

    this.loadNewStatusBills();
  }

  markBillUnpaid(param: any) {
    let updatedBill = {
      ...param,
      status: BillStatus.UNPAID,
    } as BillDetails;

    this.billService
      .updateBillDetails(updatedBill)
      .then(() => {
        this.snackbarService.openSnackBar(
          AppConstant.BILL_UPDATED_SUCCESS_MSG,
          AppConstant.UPDAE_ACTION
        );
      })
      .catch((err) => {
        console.log(err);
        this.snackbarService.openSnackBar(err, AppConstant.ERROR_ACTION);
      });

    this.loadNewStatusBills();
  }
}
