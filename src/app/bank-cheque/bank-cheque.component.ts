import { Component, OnInit } from '@angular/core';
import { AgGridServiceImpl } from '../interfaceImplementation/AgGridServiceImpl';
import { ColDef } from 'ag-grid-community';
import { RecoveryService } from '../services/recovery.service';
import { RecoveryDetails } from '../models/route';
import { DropdownRendererComponent } from '../renderer/dropdown-renderer/dropdown-renderer.component';
import { KeyValue } from '@angular/common';
import { DeleteConfirmationDialogComponent } from '../dialog/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AppConstant } from '../appConstant';
import { SnackBarService } from '../services/snackbar.service';

@Component({
  selector: 'app-bank-cheque',
  templateUrl: './bank-cheque.component.html',
  styleUrls: ['./bank-cheque.component.scss'],
})
export class BankChequeComponent extends AgGridServiceImpl implements OnInit {
  constructor(
    private recoveryService: RecoveryService,
    public dialog: MatDialog,
    private snackbarService: SnackBarService
  ) {
    super();

    this.defaultColDef = {
      editable: false,
      filter: true,
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
      floatingFilter: true,
    };
  }

  yesNoList: KeyValue<string, string>[] = [
    { key: 'YES', value: 'YES' },
    { key: 'NO', value: 'NO' },
  ];

  depositeStatusList: KeyValue<string, string>[] = [
    { key: 'NOT UPDATED', value: 'NOT UPDATED' },
    { key: 'PASSED', value: 'PASSED' },
    { key: 'BOUNCED', value: 'BOUNCED' },
  ];

  columns: ColDef[] = [
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
      field: 'chequeNo',
      flex: 2,
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
    },
    {
      headerName: 'Amount',
      field: 'amountReceived',
      flex: 2,
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
      valueFormatter: (params) => this.currencyFormatter(params),
    },
    {
      headerName: 'Is Deposited In Bank',
      field: 'isDeposite',
      flex: 2,
      editable: true,
      cellEditor: DropdownRendererComponent,
      cellEditorParams: {
        values: this.yesNoList,
      },
      valueFormatter: (params) => params.value,
      valueGetter: (params) => params.data.isDeposite,
      valueSetter: (params) => {
        params.data.isDeposite = params.newValue;
        return true;
      },
    },
    {
      headerName: 'Bank Deposited Statue',
      field: 'depositeStatus',
      flex: 2,
      editable: true,
      cellEditor: DropdownRendererComponent,
      cellEditorParams: {
        values: this.depositeStatusList,
      },
      valueFormatter: (params) => params.value,
      valueGetter: (params) => params.data.depositeStatus,
      valueSetter: (params) => {
        params.data.depositeStatus = params.newValue;
        return true;
      },
    },
    {
      headerName: 'Update',
      minWidth: 100,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.openUpdateConfirmationDialog.bind(this),
        label: 'Update',
      },
    },
  ];

  ngOnInit(): void {
    this.collection = [];
    this.colDefs = this.columns;
    this.onFetchRecoveryDetails();
  }

  onFetchRecoveryDetails() {

    let fromDate: any = new Date(2024, 9, 1);
    fromDate.setHours(0, 0, 0, 0);
    let toDate: any = new Date();
    toDate.setHours(23, 59, 59, 0);

    this.recoveryService
      .getRecoveryDetails('', fromDate, toDate)
      .then((result) => {
        this.collection = this.filterChequeRecords(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  filterChequeRecords(result: RecoveryDetails[]) {
    let filteredData = result.filter((item) => item.modeOfPayment === 'Cheque');
    filteredData.forEach((i) => {
      if (!i.isDeposite) {
        i.isDeposite = 'NO';
      }

      if (!i.depositeStatus) {
        i.depositeStatus = 'NOT UPDATED';
      }
    });

    return this.sortData(filteredData);
  }

  sortData(result: RecoveryDetails[]) {
    return result.sort((a, b) => {
      return <any>b.chequeNo - <any>a.chequeNo;
    });
  }

  openUpdateConfirmationDialog(element: any): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: {
        key: AppConstant.BANK_CHEQUE_UPDATE,
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

  currencyFormatter(params: any) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(params.value);
  }

  onUpdate(record: any) {
    this.recoveryService.updateRecovery(record.rowData).then(() => {
      this.snackbarService.openSnackBar(
        AppConstant.RECOVERY_UPDATED_SUCCESS_MSG,
        AppConstant.UPDAE_ACTION
      );
    });
  }
}
