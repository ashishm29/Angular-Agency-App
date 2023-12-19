import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppConstant } from 'src/app/appConstant';
import { DeleteConfirmationDialogComponent } from 'src/app/dialog/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { StoreDetails } from 'src/app/models/route';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { StoreService } from 'src/app/services/store.service';
import { ColDef } from 'ag-grid-community';
import { ButtonRendererComponent } from 'src/app/renderer/button-renderer/button-renderer.component';

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
      field: 'storeName',
      flex: 2,
      floatingFilter: true,
    },
    {
      field: 'address',
      flex: 1.5,
      floatingFilter: true,
    },
    {
      headerName: 'Mobile Number',
      flex: 1,
      floatingFilter: true,
      valueGetter: (params) => {
        if (params.data.altMobileNo) {
          return params.data.mobileNo + ' / ' + params.data.altMobileNo;
        }
        return params.data.mobileNo;
      },
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

  setFooter() {
    this.api.setPinnedBottomRowData([
      {
        route: 'COUNT : ' + this.collection?.length,
      },
    ]);
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

          // Keeping it for future reference
          // let unique = [...new Set(result.map((item) => item.route))];
          // let routeWiseStores: KeyValue<any, any>[] = [];
          // for (let i = 0; i < unique.length - 1; i++) {
          //   let records = this.collection.filter(
          //     (item) => item.route === unique[i]
          //   );
          //   routeWiseStores.push({ key: unique[i], value: records });
          //   console.log('Stores : ' + records.length);
          // }
        } else {
          console.log(AppConstant.STORE_NOT_FOUND_MSG);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.setFooter();
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
