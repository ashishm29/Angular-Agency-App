import { ColDef } from 'ag-grid-community';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppConstant } from 'src/app/appConstant';
import { ButtonRendererComponent } from 'src/app/renderer/button-renderer/button-renderer.component';
import { DeleteConfirmationDialogComponent } from 'src/app/dialog/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { BillDetails, RecoveryDetails } from 'src/app/models/route';
import { BillService } from 'src/app/services/bill.service';
import { RecoveryService } from 'src/app/services/recovery.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { RecoveryExcelService } from 'src/app/services/ExcelExport/recovery-excel-service.service';

@Component({
  selector: 'app-delete-recovery',
  templateUrl: './delete-recovery.component.html',
  styleUrls: ['./delete-recovery.component.scss'],
})
export class DeleteRecoveryComponent implements OnInit {
  collection: RecoveryDetails[] = [];
  frameworkComponents: any;
  api: any;
  gridOptions = {
    // turns OFF row hover, it's on by default
    suppressRowHoverHighlight: false,
    // turns ON column hover, it's off by default
    columnHoverHighlight: false,
    pagination: false,
    paginationPageSize: 50,
    suppressHorizontalScroll: false,
    alwaysShowHorizontalScroll: true,
  };

  public defaultColDef: ColDef = {
    editable: false,
    filter: true,
    minWidth: 200,
    wrapText: true,
    autoHeight: true,
    cellStyle: {
      wordBreak: 'normal',
      lineHeight: 'unset',
    },
  };

  colDefs: ColDef[] = [
    {
      field: 'route',
      flex: 1.5,
      floatingFilter: true,
    },
    {
      headerName: 'Store Name',
      field: 'storeName.storeName',
      flex: 2,
      floatingFilter: true,
    },
    {
      field: 'address',
      flex: 1.5,
      floatingFilter: true,
    },
    {
      field: 'billNumber',
      flex: 1.5,
      floatingFilter: true,
    },
    {
      field: 'amountReceived',
      flex: 1.5,
      floatingFilter: true,
    },
    {
      field: 'receiptNumber',
      flex: 1.5,
      floatingFilter: true,
    },
    {
      headerName: 'Delete',
      minWidth: 100,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.onClick.bind(this),
        label: 'X',
      },
    },
  ];

  constructor(
    public dialog: MatDialog,
    private recoveryService: RecoveryService,
    private billService: BillService,
    private snackbarService: SnackBarService,
    private excelService: RecoveryExcelService
  ) {
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    };
  }

  onGridReady(params: any) {
    this.api = params.api;
  }

  ngOnInit(): void {
    this.onFetchRecoveryDetails();
  }

  onFetchRecoveryDetails() {
    this.collection = [];
    this.recoveryService
      .getRecoveryDetails()
      .then((result) => {
        if (result && result.length > 0) {
          this.collection = this.sortData(result);
        } else {
          console.log(AppConstant.STORE_NOT_FOUND_MSG);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  sortData(result: RecoveryDetails[]) {
    return result.sort((a, b) => {
      if (a.route === b.route) {
        return a.storeName.storeName < b.storeName.storeName ? -1 : 1;
      } else {
        return a.route < b.route ? -1 : 1;
      }
    });
  }

  onDelete(element: RecoveryDetails) {
    this.recoveryService
      .deleteRecovery(element.id)
      .then(() => {
        let index = this.collection.indexOf(element);
        if (index >= 0) {
          this.collection.splice(index, 1);
          let array = this.collection.slice();
          this.collection = array;
          this.api.updateGridOptions({ rowData: this.collection });
          this.updateBillPendingAmount(element);
        }
      })
      .catch((err) => {
        console.log(err);
        this.snackbarService.openSnackBar(err, AppConstant.ERROR_ACTION);
      });
  }

  updateBillPendingAmount(element: RecoveryDetails) {
    this.billService
      .getFilteredBills('', '', '', '', element.billNumber)
      .then((result) => {
        if (result && result.length > 0) {
          let billobj = {
            ...result[0],
            pendingAmount: result[0].pendingAmount + +element.amountReceived,
          } as BillDetails;

          this.billService
            .updateBillPendingAmount(billobj)
            .then(() => {
              this.snackbarService.openSnackBar(
                AppConstant.BILL_UPDATED_SUCCESS_MSG,
                AppConstant.UPDAE_ACTION
              );
              console.log('Bill updated successfully...');
            })
            .catch((err) => {
              console.log(err);
              this.snackbarService.openSnackBar(err, AppConstant.ERROR_ACTION);
            });
        } else {
          console.log('No bill found...');
        }
      })
      .catch((err) => {
        console.log(err);
        this.snackbarService.openSnackBar(err, AppConstant.ERROR_ACTION);
      });
  }

  openDeleteConfirmationDialog(element: RecoveryDetails): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { key: AppConstant.RECOVERY, value: element.receiptNumber },
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

  onClick(params: any) {
    let index = this.collection.indexOf(params.rowData);
    if (index >= 0) {
      this.openDeleteConfirmationDialog(params.rowData);
    }
  }

  exportToExcel() {
    this.excelService.ExportReportExcel(this.collection, undefined, new Date());
  }
}
