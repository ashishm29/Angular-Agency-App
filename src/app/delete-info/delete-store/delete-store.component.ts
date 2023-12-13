import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppConstant } from 'src/app/appConstant';
import { DeleteConfirmationDialogComponent } from 'src/app/dialog/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { StoreDetails } from 'src/app/models/route';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { StoreService } from 'src/app/services/store.service';
import { ColDef } from 'ag-grid-community';
import { ButtonRendererComponent } from 'src/app/button-renderer/button-renderer.component';

// Row Data Interface
interface IRow {
  mission: string;
  company: string;
  location: string;
  date: string;
  rocket: string;
  price: number;
  successful: boolean;
}

@Component({
  selector: 'app-delete-store',
  templateUrl: './delete-store.component.html',
  styleUrls: ['./delete-store.component.scss'],
})
export class DeleteStoreComponent implements OnInit {
  collection: StoreDetails[] = [];
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
    editable: true,
    filter: true,
  };

  colDefs: ColDef[] = [
    {
      field: 'route',
      flex: 1.5,
      minWidth: 200,
      wrapText: true,
      editable: false,
      autoHeight: true,
      cellStyle: {
        wordBreak: 'normal',
        lineHeight: 'unset',
      },
    },
    {
      field: 'storeName',
      flex: 2,
      minWidth: 200,
      wrapText: true,
      editable: false,
      autoHeight: true,
      cellStyle: {
        wordBreak: 'normal',
        lineHeight: 'unset',
      },
    },
    {
      field: 'address',
      flex: 1.5,
      minWidth: 200,
      wrapText: true,
      editable: false,
      autoHeight: true,
      cellStyle: {
        wordBreak: 'normal',
        lineHeight: 'unset',
      },
    },
    {
      headerName: 'Mobile Number',
      flex: 1,
      minWidth: 200,
      wrapText: true,
      editable: false,
      valueGetter: (params) => {
        if (params.data.altMobileNo) {
          return params.data.mobileNo + ' / ' + params.data.altMobileNo;
        }
        return params.data.mobileNo;
      },
      cellStyle: { wordBreak: 'normal', lineHeight: 'unset' },
    },
    {
      headerName: 'Delete',
      minWidth: 100,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.onDelete.bind(this),
        label: 'X',
      },
    },
  ];

  constructor(
    public dialog: MatDialog,
    private storeService: StoreService,
    private snackbarService: SnackBarService
  ) {
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    };
  }

  onGridReady(params: any) {
    this.api = params.api;
  }

  ngOnInit(): void {
    this.onFetchStoreDetails();
  }

  onFetchStoreDetails() {
    this.collection = [];
    this.storeService
      .getStores('')
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

  sortData(result: StoreDetails[]) {
    return result.sort((a, b) => {
      if (a.route === b.route) {
        return a.storeName < b.storeName ? -1 : 1;
      } else {
        return a.route < b.route ? -1 : 1;
      }
    });
  }

  onDeleteStore(element: StoreDetails) {
    this.storeService
      .deleteStore(element.id)
      .then(() => {
        let index = this.collection.indexOf(element);
        if (index >= 0) {
          this.collection.splice(index, 1);
          let array = this.collection.slice();
          this.collection = array;
          this.api.updateGridOptions({ rowData: this.collection });
        }

        this.snackbarService.openSnackBar(
          AppConstant.STORE_DELETED_SUCCESS_MSG,
          AppConstant.DELETE_ACTION
        );
      })
      .catch((err) => {
        console.log(err);
        this.snackbarService.openSnackBar(err, AppConstant.ERROR_ACTION);
      });
  }

  openDeleteConfirmationDialog(element: StoreDetails): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { key: AppConstant.STORE, value: element.storeName },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.delete == AppConstant.YES_ACTION) {
        console.log(AppConstant.YES_ACTION);
        this.onDeleteStore(element);
      } else {
        console.log(AppConstant.NO_ACTION);
      }
    });
  }

  onDelete(params: any) {
    let index = this.collection.indexOf(params.rowData);
    if (index >= 0) {
      this.openDeleteConfirmationDialog(params.rowData);
    }
  }
}
