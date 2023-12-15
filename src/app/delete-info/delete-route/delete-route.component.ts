import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppConstant } from 'src/app/appConstant';
import { DeleteConfirmationDialogComponent } from 'src/app/dialog/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { Route } from 'src/app/models/route';
import { RouteService } from 'src/app/services/route.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { ColDef } from 'ag-grid-community';
import { ButtonRendererComponent } from 'src/app/button-renderer/button-renderer.component';
import {
  ModuleRegistry,
} from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

@Component({
  selector: 'app-delete-route',
  templateUrl: './delete-route.component.html',
  styleUrls: ['./delete-route.component.scss'],
})
export class DeleteRouteComponent implements OnInit {
  collection: Route[] = [];
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
      headerName: 'Route',
      field: 'routeName',
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
      headerName: 'Delete',
      width: 100,
      minWidth: 100,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.onDelete.bind(this),
        label: 'X',
        visibility: false,
      },
    },
  ];

  onGridReady(params: any) {
    this.api = params.api;
    // this.setFooter();
  }

  onDelete(params: any) {
    let index = this.collection.indexOf(params.rowData);
    if (index >= 0) {
      this.openDeleteConfirmationDialog(params.rowData);
    }
  }

  constructor(
    public dialog: MatDialog,
    private routeService: RouteService,
    private snackbarService: SnackBarService
  ) {
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    };
  }

  ngOnInit(): void {
    this.onFetchRoutesDetails();
  }

  setFooter() {
    this.api.setPinnedBottomRowData([
      {
        routeName: 'COUNT : ' + this.collection?.length,
      },
    ]);
  }

  onFetchRoutesDetails() {
    this.collection = [];
    this.routeService
      .getRoutes()
      .then((result) => {
        if (result && result.length > 0) {
          this.collection = this.sortData(result);
        } else {
          console.log(AppConstant.ROUTE_NOT_FOUND_MSG);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.setFooter();
      });
  }

  sortData(result: Route[]) {
    return result.sort((a, b) => {
      return a.routeName < b.routeName ? -1 : 1;
    });
  }

  onDeleteRoute(element: Route) {
    this.routeService
      .deleteRoute(element.id)
      .then(() => {
        let index = this.collection.indexOf(element);
        if (index >= 0) {
          this.collection.splice(index, 1);
          let array = this.collection.slice();
          this.collection = array;
          this.api.updateGridOptions({ rowData: this.collection });
        }

        this.snackbarService.openSnackBar(
          AppConstant.ROUTE_DELETED_SUCCESS_MSG,
          AppConstant.DELETE_ACTION
        );
      })
      .catch((err) => {
        console.log(err);
        this.snackbarService.openSnackBar(err, AppConstant.ERROR_ACTION);
      });
  }

  openDeleteConfirmationDialog(element: Route): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { key: AppConstant.ROUTE, value: element.routeName },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.delete == AppConstant.YES_ACTION) {
        console.log(AppConstant.YES_ACTION);
        this.onDeleteRoute(element);
      } else {
        console.log(AppConstant.NO_ACTION);
      }
    });
  }
}
