import { ColDef } from 'ag-grid-community';
import { Component, Input, OnInit } from '@angular/core';
import { RecoveryHistory } from 'src/app/models/route';
import { UserService } from 'src/app/services/user.service';
import { UntypedFormControl } from '@angular/forms';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { AppConstant } from 'src/app/appConstant';
import { RecoveryService } from 'src/app/services/recovery.service';
import { DatePipe } from '@angular/common';
import { ButtonRendererComponent } from 'src/app/renderer/button-renderer/button-renderer.component';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from 'src/app/dialog/delete-confirmation-dialog/delete-confirmation-dialog.component';

@Component({
  selector: 'app-recovery-from-salesman',
  templateUrl: './recovery-from-salesman.component.html',
  styleUrls: ['./recovery-from-salesman.component.scss'],
})
export class RecoveryFromSalesmanComponent implements OnInit {
  collection: RecoveryHistory[] = [];
  salesmanCollection: string[] = [];
  salesmanSelected!: UntypedFormControl;
  receivedAmount!: UntypedFormControl;
  pendingAmount!: UntypedFormControl;

  @Input() fromDate!: Date | any;
  @Input() toDate!: Date | any;
  @Input() salesman!: string | any;
  @Input() paymentMode!: string | any;
  @Input() totalAmount!: number | any;

  constructor(
    private userService: UserService,
    private recoveryService: RecoveryService,
    private snackbarService: SnackBarService,
    private datePipe: DatePipe,
    public dialog: MatDialog
  ) {
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    };

    this.receivedAmount = new UntypedFormControl();
    this.pendingAmount = new UntypedFormControl();
  }

  ngOnInit(): void {
    this.getSalesmanDetail();
    this.getRecords();
  }

  onGridReady(params: any) {
    this.api = params.api;
  }

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
    floatingFilter: true,
  };

  colDefs: ColDef[] = [
    {
      field: 'salesman',
      flex: 1,
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
    },
    {
      field: 'fromDate',
      flex: 1.5,
      minWidth: 200,
      wrapText: true,
      editable: false,
      autoHeight: true,
      valueGetter: (param) => {
        return this.datePipe.transform(
          param.data.fromDate.toDate(),
          'dd-MM-yyyy'
        );
      },
    },
    {
      field: 'toDate',
      flex: 1.5,
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
      valueGetter: (param) => {
        return this.datePipe.transform(
          param.data.toDate.toDate(),
          'dd-MM-yyyy'
        );
      },
    },
    {
      field: 'totalAmount',
      flex: 1.5,
      minWidth: 200,
      wrapText: true,
      editable: false,
      autoHeight: true,
    },
    {
      field: 'receivedAmount',
      flex: 1.5,
      minWidth: 200,
      wrapText: true,
      editable: true,
      autoHeight: true,
      valueSetter: (params) => {
        params.data.receivedAmount = params.newValue;
        params.data.pendingAmount =
          params.data.totalAmount - params.data.receivedAmount;
        return true;
      },
    },
    {
      field: 'pendingAmount',
      flex: 1.5,
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
      editable: true,
    },
    {
      headerName: '',
      minWidth: 100,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.openUpdateConfirmationDialog.bind(this),
        label: 'Update',
      },
      floatingFilter: false,
    },
    {
      headerName: '',
      minWidth: 100,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.openDeleteConfirmationDialog.bind(this),
        label: 'X',
      },
      floatingFilter: false,
    },
  ];

  getSalesmanDetail() {
    this.salesmanCollection = [];
    this.userService
      .getSalesmanList()
      .then((records) => {
        if (records && records.length > 0) {
          let salesman = records.filter((c) => c.role == 'salesman');

          this.salesmanCollection.push('ALL');
          salesman.forEach((item) =>
            this.salesmanCollection.push(item.username)
          );
        }
      })
      .catch((err) => {
        this.snackbarService.openSnackBar(err, AppConstant.ERROR_ACTION);
      });
  }

  onAdd() {
    this.receivedAmount.reset();
    this.pendingAmount.reset();
    if (this.paymentMode.value !== 'Cash') {
      this.snackbarService.openSnackBar(
        AppConstant.ONLY_CASH_ENTRIES_ALLOWED_MSG,
        AppConstant.SAVE_ACTION
      );
      return;
    }

    if (this.salesman.value === 'ALL') {
      this.snackbarService.openSnackBar(
        AppConstant.SELECT_SALESMAN_MSG,
        AppConstant.SAVE_ACTION
      );
      return;
    }

    if (
      this.fromDate.value &&
      this.toDate.value &&
      this.salesman &&
      this.totalAmount &&
      this.totalAmount > 0
    ) {
      let param = {
        createdDate: new Date(),
        receivedAmount: +this.receivedAmount.value,
        salesman: this.salesman.value,
        pendingAmount: this.totalAmount - +this.receivedAmount.value,
        toDate: this.toDate.value,
        fromDate: this.fromDate.value,
        totalAmount: this.totalAmount,
      } as unknown as RecoveryHistory;

      let salemanEntries = this.collection.filter(
        (item) => item.salesman === param.salesman
      );

      if (this.checkDateOverlap(param.fromDate, param.toDate, salemanEntries)) {
        this.snackbarService.openSnackBar(
          AppConstant.RECORD_ALREADY_PRESENT_FOR_DATE_RANGE_MSG,
          AppConstant.SAVE_ACTION
        );

        return;
      }

      this.recoveryService
        .addRecoveryFromSalesman(param)
        .then(() => {
          this.snackbarService.openSnackBar(
            AppConstant.RECORD_ADDED_SUCCESS_MSG,
            AppConstant.SAVE_ACTION
          );

          this.getRecords();
          this.receivedAmount.reset();
        })
        .catch((err) => {
          this.snackbarService.openSnackBar(err, AppConstant.ERROR_ACTION);
        });
    }
  }

  checkDateOverlap(
    newStartDate: Date,
    newEndDate: Date,
    salemanEntries: any
  ): boolean {
    for (const entry of salemanEntries) {
      if (
        (newStartDate >= entry.fromDate.toDate() &&
          newStartDate <= entry.toDate.toDate()) ||
        (newEndDate >= entry.fromDate.toDate() &&
          newEndDate <= entry.toDate.toDate()) ||
        (newStartDate <= entry.fromDate.toDate() &&
          newEndDate >= entry.toDate.toDate())
      ) {
        return true; // Overlapping date range found
      }
    }
    return false; // No overlapping date range found
  }

  getRecords() {
    this.recoveryService
      .getRecoveryFromSalesman()
      .then((records) => {
        if (records && records.length > 0) {
          this.collection = records;
        }
      })
      .catch((err) => {
        this.snackbarService.openSnackBar(err, AppConstant.ERROR_ACTION);
      });
  }

  OnAmountReceivedChanged() {
    let pendingAmount = 0;
    if (this.receivedAmount.value && this.receivedAmount.value > 0) {
      pendingAmount = this.totalAmount - this.receivedAmount.value;
    }
    this.pendingAmount.patchValue(pendingAmount);
  }

  onUpdate(param: any) {
    console.log(param.rowData);
    this.recoveryService
      .updateRecoveryFromSalesman(param.rowData)
      .then(() => {
        this.snackbarService.openSnackBar(
          AppConstant.RECORD_UPDATED_SUCCESS_MSG,
          AppConstant.UPDAE_ACTION
        );
        this.getRecords();
      })
      .catch((err) => {
        this.snackbarService.openSnackBar(err, AppConstant.ERROR_ACTION);
      });
  }

  onDelete(param: any) {
    let index = this.collection.indexOf(param.rowData);
    if (index >= 0) {
      this.recoveryService
        .deleteRecoveryFromSalesman(param.rowData.id)
        .then(() => {
          this.collection.splice(index, 1);
          let array = this.collection.slice();
          this.collection = array;
          this.api.updateGridOptions({ rowData: this.collection });

          this.snackbarService.openSnackBar(
            AppConstant.RECORD_DELETED_SUCCESS_MSG,
            AppConstant.DELETE_ACTION
          );
        })
        .catch((err) => {
          this.snackbarService.openSnackBar(err, AppConstant.ERROR_ACTION);
        });
    }
  }

  openDeleteConfirmationDialog(element: any): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: {
        key: AppConstant.SALESMAN_RECOVERY_DELETE,
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
        key: AppConstant.SALESMAN_RECOVERY_UPDATE,
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
}
