import { ColDef } from 'ag-grid-community';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { AppConstant } from 'src/app/appConstant';
import { RecoveryDetails } from 'src/app/models/route';
import { RecoveryService } from 'src/app/services/recovery.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { ButtonRendererComponent } from 'src/app/button-renderer/button-renderer.component';

@Component({
  selector: 'app-edit-recovery-details',
  templateUrl: './edit-recovery-details.component.html',
  styleUrls: ['./edit-recovery-details.component.scss'],
})
export class EditRecoveryDetailsComponent implements OnInit {
  billNoControl = new UntypedFormControl();
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
    // getRowStyle: function (params: any) {
    //   if (params.node.rowPinned) {
    //     return { 'font-weight': 'bold' };
    //   } else {
    //     return { 'font-weight': 'bold' };
    //   }
    // },
  };

  public defaultColDef: ColDef = {
    editable: true,
    filter: true,
  };

  colDefs: ColDef[] = [
    {
      headerName: 'Bill Number',
      field: 'billNumber',
      flex: 1.5,
      minWidth: 200,
      wrapText: true,
      editable: false,
      autoHeight: true,
    },
    {
      headerName: 'Amount Received',
      field: 'amountReceived',
      flex: 1.5,
      minWidth: 200,
      wrapText: true,
      editable: false,
      autoHeight: true,
    },
    {
      headerName: 'Mode',
      field: 'modeOfPayment',
      flex: 1.5,
      minWidth: 200,
      wrapText: true,
      editable: false,
      autoHeight: true,
    },
    {
      headerName: 'Receipt Number',
      field: 'receiptNumber',
      flex: 1.5,
      minWidth: 200,
      wrapText: true,
      editable: true,
      autoHeight: true,
    },
    {
      width: 100,
      minWidth: 100,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.onClick.bind(this),
        label: 'Update',
      },
    },
  ];

  onGridReady(params: any) {
    this.api = params.api;
  }

  onClick(params: any) {
    let index = this.collection.indexOf(params.rowData);
    if (index >= 0) {
      let recoveryDetails = {
        ...params.rowData,
      };
      this.recoveryService.updateRecovery(recoveryDetails).then(() => {
        this.snackbarService.openSnackBar(
          AppConstant.RECOVERY_UPDATED_SUCCESS_MSG,
          AppConstant.UPDAE_ACTION
        );
      });
    } else {
      this.snackbarService.openSnackBar(
        AppConstant.RECOVERY_UPDATED_SUCCESS_MSG,
        AppConstant.UPDAE_ACTION
      );
    }
  }

  constructor(
    private snackbarService: SnackBarService,
    private recoveryService: RecoveryService
  ) {
    this.billNoControl = new UntypedFormControl();
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    };
  }

  ngOnInit(): void {}

  search() {
    this.collection = [];
    this.recoveryService
      .getRecoveryDetails(this.billNoControl.value, '', '')
      .then((result) => {
        if (result && result.length > 0) {
          this.collection = result;
        } else {
          console.log(AppConstant.BILL_NOT_FOUND_MSG);
          this.snackbarService.openSnackBar(
            AppConstant.RECOVERY_NOT_FOUND_MSG,
            AppConstant.SEARCH_ACTION
          );
        }
      });
  }
  onUpdateBill() {}
}
