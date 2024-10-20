import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { BaseCompany } from '../abstract/baseCompany';
import { ProductService } from '../services/product.service';
import { ColDef } from 'ag-grid-community';
import { ButtonRendererComponent } from '../renderer/button-renderer/button-renderer.component';
import { Purchase } from '../models/route';
import { PurchaseService } from '../services/purchase.service';
import { DatePipe, KeyValue } from '@angular/common';
import { AppConstant } from '../appConstant';
import { SnackBarService } from '../services/snackbar.service';
import { DeleteConfirmationDialogComponent } from '../dialog/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DropdownRendererComponent } from '../renderer/dropdown-renderer/dropdown-renderer.component';
import {
  PinnedRowModel,
  RowClassParams,
  RowStyle,
} from '@ag-grid-community/core';
import { style } from '@angular/animations';
import { CustomPinnedRowRendererComponent } from '../renderer/custom-pinned-row-renderer/custom-pinned-row-renderer.component';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss'],
})
export class PurchaseComponent extends BaseCompany implements OnInit {
  formGroup!: UntypedFormGroup;
  totalBillAmount!: number;
  totalRevisedAmount!: number;

  collection: Purchase[] = [];
  paymentStatusList: KeyValue<string, string>[] = [
    { key: 'PENDING', value: 'PENDING' },
    { key: 'PAID', value: 'PAID' },
  ];
  frameworkComponents: any;
  api!: any;
  gridOptions = {
    suppressRowHoverHighlight: false,
    columnHoverHighlight: false,
    pagination: false,
    paginationPageSize: 10,
    suppressHorizontalScroll: false,
    alwaysShowHorizontalScroll: true,
  };

  public defaultColDef: ColDef = {
    editable: false,
    filter: true,
    minWidth: 200,
    wrapText: true,
    autoHeight: true,
    floatingFilter: true,
  };

  colDefs: ColDef[] = [
    {
      field: 'companyName',
      flex: 2,
      cellRendererSelector: (params) => {
        if (params.node.rowPinned) {
          return {
            component: CustomPinnedRowRendererComponent,
            params: {
              style: { color: '#000000', fontWeight: 'bolder' },
            },
          };
        } else {
          // rows that are not pinned don't use any cell renderer
          return undefined;
        }
      },
    },
    {
      field: 'billDate',
      flex: 2,
      valueGetter: (param) => {
        if (!param.data.billDate) return;

        return this.datePipe.transform(
          param.data.billDate.toDate(),
          'dd-MM-yyyy'
        );
      },
    },
    {
      field: 'billNumber',
      flex: 2,
    },
    {
      field: 'billAmount',
      flex: 2,
      editable: true,
      filter: 'agNumberColumnFilter',
      aggFunc: 'sum',
      valueFormatter: (params) => this.currencyFormatter(params),
      cellRendererSelector: (params) => {
        if (params.node.rowPinned) {
          return {
            component: CustomPinnedRowRendererComponent,
            params: {
              value: this.currencyFormatter(params),
              style: { color: '#000000', fontWeight: 'bolder' },
            },
          };
        } else {
          return undefined;
        }
      },
      // filterParams: {
      //   suppressAndOrCondition: true,
      //   filterOptions: ['greaterThan', 'equals'],
      // },
    },
    {
      field: 'revisedAmount',
      flex: 2,
      editable: true,
      aggFunc: 'sum',
      valueFormatter: (params) => this.currencyFormatter(params),
      cellRendererSelector: (params) => {
        if (params.node.rowPinned) {
          return {
            component: CustomPinnedRowRendererComponent,
            params: {
              value: this.currencyFormatter(params),
              style: { color: '#000000', fontWeight: 'bolder' },
            },
          };
        } else {
          return undefined;
        }
      },
    },
    {
      field: 'comment',
      flex: 2,
      editable: true,
    },
    {
      field: 'paymentDate',
      flex: 2,
      valueGetter: (param) => {
        if (!param.data.paymentDate) return;

        return this.datePipe.transform(
          param.data.paymentDate.toDate(),
          'dd-MM-yyyy'
        );
      },
    },
    {
      field: 'paymentStatus',
      flex: 2,
      editable: true,
      cellEditor: DropdownRendererComponent,
      cellEditorParams: {
        values: this.paymentStatusList,
      },
      valueFormatter: this.dropdownValueFormatter,
      valueGetter: (params) => params.data.paymentStatus,
      valueSetter: (params) => {
        params.data.paymentStatus = params.newValue;
        return true;
      },
    },
    {
      headerName: 'Update',
      minWidth: 100,
      // cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.openUpdateConfirmationDialog.bind(this),
        label: 'Update',
      },
      cellRendererSelector: (params) => {
        if (!params.node.rowPinned) {
          return {
            component: 'buttonRenderer',
          };
        } else {
          return undefined;
        }
      },
    },
    {
      headerName: 'Delete',
      minWidth: 100,
      // cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.openDeleteConfirmationDialog.bind(this),
        label: 'Delete',
      },
      cellRendererSelector: (params) => {
        if (!params.node.rowPinned) {
          return {
            component: 'buttonRenderer',
          };
        } else {
          return undefined;
        }
      },
    },
  ];

  onGridReady(params: any) {
    this.api = params.api;
    this.api.addEventListener('filterChanged', this.onFilterChanged.bind(this));
  }

  constructor(
    productService: ProductService,
    private purchaseService: PurchaseService,
    private datePipe: DatePipe,
    private snackbarService: SnackBarService,
    public dialog: MatDialog
  ) {
    super(productService);
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    };
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      companyName: new FormControl('', [Validators.required]),
      billDate: new FormControl('', [Validators.required]),
      billNumber: new FormControl('', [Validators.required]),
      billAmount: new FormControl('', [Validators.required]),
      revisedAmount: new FormControl('', [Validators.required]),
      paymentDate: new FormControl(''),
      paymentStatus: new FormControl('', [Validators.required]),
      comment: new FormControl(''),
    });

    this.onFetchCompanys();
    this.getPurchaseDetails();
  }

  onFilterChanged(args: any) {
    this.api.updateGridOptions({ rowData: this.collection });

    let filteredData = this.api.rowModel.rowsToDisplay;

    let data: Purchase[] = [];

    for (const item of filteredData) {
      data.push(item.data);
    }
    this.getTotalAmount(data);

    console.log('Collection : ' + this.collection.length);
    this.api.setGridOption('pinnedBottomRowData', [
      {
        companyName: 'TOTAL :',
        billAmount: this.totalBillAmount,
        revisedAmount: this.totalRevisedAmount,
      },
    ]);
  }

  onAdd() {
    if (this.formGroup) {
      console.log(this.formGroup);
      let request = {
        ...this.formGroup.value,
        createdDate: new Date(),
      } as Purchase;

      if (this.formGroup.valid) {
        if (this.validateBillNumber(request.billNumber) >= 0) {
          this.snackbarService.openSnackBar(
            'This Bill number already exist',
            AppConstant.SAVE_ACTION
          );
          return;
        }

        let isValid = this.validateBillNumber(request.billNumber);
        console.log('ISValid : ' + isValid);

        this.purchaseService
          .add(request)
          .then(() => {
            this.snackbarService.openSnackBar(
              AppConstant.DETAILS_ADDED_SUCCESS_MSG,
              AppConstant.SAVE_ACTION
            );
            this.getPurchaseDetails();
            this.formGroup.reset();
          })
          .catch((err) => {
            console.log(err);
            this.snackbarService.openSnackBar(err, AppConstant.ERROR_ACTION);
          });
      } else {
        this.snackbarService.openSnackBar(
          'Please fill all the information.',
          AppConstant.ERROR_ACTION
        );
      }
    }
  }

  validateBillNumber(billNumber: string): number {
    return this.collection.findIndex((c) => c.billNumber === billNumber);
  }

  getPurchaseDetails() {
    this.purchaseService.get().then((result) => {
      if (result && result.length > 0) {
        this.collection = this.sortData(result);
        this.api.updateGridOptions({ rowData: this.collection });
        this.getTotalAmount(this.collection);
        this.api.setGridOption('pinnedBottomRowData', [
          {
            companyName: 'TOTAL :',
            billAmount: this.totalBillAmount,
            revisedAmount: this.totalRevisedAmount,
          },
        ]);
      }
    });
  }

  getTotalAmount(data: Purchase[]) {
    this.totalBillAmount = 0;
    this.totalRevisedAmount = 0;

    this.totalBillAmount = data
      .map((t) => {
        return +t.billAmount;
      })
      .reduce((acc, value) => acc + value, 0);

    this.totalRevisedAmount = data
      .map((t) => {
        return +t.revisedAmount;
      })
      .reduce((acc, value) => acc + value, 0);
  }

  sortData(result: Purchase[]) {
    return result.sort((a, b) => {
      // Latest first
      return <any>b.createdDate.toDate() - <any>a.createdDate.toDate();
    });
  }

  onDelete(element: any) {
    this.purchaseService
      .delete(element.rowData.id)
      .then(() => {
        let index = this.collection.indexOf(element.rowData);
        if (index >= 0) {
          this.collection.splice(index, 1);
          let array = this.collection.slice();
          this.collection = array;
          this.api.updateGridOptions({ rowData: this.collection });
        }

        this.snackbarService.openSnackBar(
          AppConstant.RECORD_DELETED_SUCCESS_MSG,
          AppConstant.DELETE_ACTION
        );
      })
      .catch((err) => {
        console.log(err);
        this.snackbarService.openSnackBar(err, AppConstant.ERROR_ACTION);
      });
  }

  onUpdate(record: any) {
    let element = record.rowData;
    this.purchaseService
      .update(element)
      .then(() => {
        this.snackbarService.openSnackBar(
          AppConstant.RECORD_UPDATED_SUCCESS_MSG,
          AppConstant.UPDAE_ACTION
        );
        this.getPurchaseDetails();
      })
      .catch((err) => {
        this.snackbarService.openSnackBar(err, AppConstant.ERROR_ACTION);
      });
  }

  openDeleteConfirmationDialog(element: any): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: {
        key: AppConstant.PURCHASE_DELETE,
        object: element.rowData,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.delete == AppConstant.YES_ACTION) {
        console.log(AppConstant.YES_ACTION);
        this.onDelete(element);
      } else {
        console.log(AppConstant.NO_ACTION);
      }
    });
  }

  openUpdateConfirmationDialog(element: any): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: {
        key: AppConstant.PURCHASE_UPDATE,
        object: element.rowData,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.delete == AppConstant.YES_ACTION) {
        console.log(AppConstant.YES_ACTION);
        this.onUpdate(element);
      } else {
        console.log(AppConstant.NO_ACTION);
      }
    });
  }

  dropdownValueFormatter(params: any): string {
    return params.value;
  }

  currencyFormatter(params: any) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(params.value);
  }
}
