import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  ViewChild,
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
import { BillDetails } from '../models/route';
import { SnackBarService } from '../services/snackbar.service';
import { DatePipe } from '@angular/common';
import { ValidationDialogService } from '../services/validation-dialog.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-sale-book',
  templateUrl: './sale-book.component.html',
  styleUrls: ['./sale-book.component.scss'],
})
export class SaleBookComponent extends AgGridServiceImpl implements OnInit {
  @ViewChild('billFormDirective') private billFormDirective!: NgForm;
  routeName!: string;
  myControl = new UntypedFormControl();
  isClicked: boolean = false;
  buttonText: string = AppConstant.ADD_BILL_BTN_TEXT;
  localRouteValue!: string;
  callbackFunction = new EventEmitter<{ action: string; value: any }>();

  constructor(
    public billService: BillService,
    private localStorageService: LocalStorageService,
    @Inject(MY_SERVICE_TOKEN) public storeRouteService: StoreRouteService,
    private datePipe: DatePipe,
    private snackbarService: SnackBarService,
    private validationDialogService: ValidationDialogService
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
    },
    {
      field: 'revisedAmount',
      flex: 2,
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
      editable: true,
    },
    {
      minWidth: 80,
      width: 80,
      cellRenderer: 'agGridMenuRenderer',
      cellRendererParams: {
        callBack: this.callbackFunction,
      },
    },
  ];

  ngOnInit(): void {
    this.initialize();
    this.collection = [];
    this.colDefs = this.columns;
    this.storeRouteService.onFetchRoute();
    this.loadTodaysBills();

    if (this.localRouteValue) {
      this.storeRouteService.onRouteSelectionChange(this.localRouteValue);
    }

    this.callbackFunction
      .pipe(
        map((val) => {
          console.log(val.action);
          console.log(val.value);
        })
      )
      .subscribe();
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
  }

  loadTodaysBills() {
    let todaysDate = new Date();
    todaysDate.setHours(0, 0, 0, 0);

    this.billService
      .getBillByDate(todaysDate)
      .then((result) => {
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
}
