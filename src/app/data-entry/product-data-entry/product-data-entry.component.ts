import { ColDef } from 'ag-grid-community';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AppConstant } from 'src/app/appConstant';
import { DeleteConfirmationDialogComponent } from 'src/app/dialog/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { CompanyDetail, ProductDetail } from 'src/app/models/route';
import { ButtonRendererComponent } from 'src/app/renderer/button-renderer/button-renderer.component';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { ProductService } from 'src/app/services/product.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-product-data-entry',
  templateUrl: './product-data-entry.component.html',
  styleUrls: ['./product-data-entry.component.scss'],
})
export class ProductDataEntryComponent {
  formGroup!: UntypedFormGroup;
  companyNameFormControl!: UntypedFormControl;
  productNameFormControl!: UntypedFormControl;

  @ViewChild('formDirective') private formDirective!: NgForm;
  collection: ProductDetail[] = [];
  companyCollection: CompanyDetail[] = [];

  constructor(
    private snackbarService: SnackBarService,
    private productService: ProductService,
    public dialog: MatDialog,
    private datePipe: DatePipe
  ) {
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    };
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
      field: 'productId',
      flex: 1,
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
    },
    {
      field: 'companyName',
      flex: 1,
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
    },
    {
      field: 'productName',
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
        onClick: this.onDelete.bind(this),
        label: 'X',
      },
      floatingFilter: false,
    },
  ];

  updateGrid() {
    this.api.updateGridOptions({ rowData: this.collection });
  }

  ngOnInit(): void {
    this.companyNameFormControl = new UntypedFormControl();
    this.productNameFormControl = new UntypedFormControl();
    this.onFetchCompanys();
    this.onFetchProducts();
  }

  generateProductId(): string {
    let currDate = new Date();
    return this.datePipe.transform(currDate, 'MMddyyyyHHmmss') as string;
  }

  onAddProduct() {
    if (this.companyNameFormControl) {
      let params = {
        productId: this.generateProductId(),
        productName: this.productNameFormControl.value,
        companyId: this.companyNameFormControl.value.companyId,
        companyName: this.companyNameFormControl.value.companyName,
      } as ProductDetail;

      console.log(params);
      this.productService
        .add(params)
        .then(() => {
          this.snackbarService.openSnackBar(
            AppConstant.RECORD_ADDED_SUCCESS_MSG,
            AppConstant.SAVE_ACTION
          );
          this.collection.push({
            productId: params.productId,
            productName: params.productName,
            companyId: params.companyId,
            companyName: params.companyName,
            id: '',
          });
          this.updateGrid();
          //this.companyNameFormControl.reset();
          this.productNameFormControl.reset();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  onUpdateUser(param: any) {
    this.productService
      .updateProduct(param.rowData)
      .then(() => {
        this.snackbarService.openSnackBar(
          AppConstant.RECORD_UPDATED_SUCCESS_MSG,
          AppConstant.UPDAE_ACTION
        );
        this.onFetchProducts();
      })
      .catch((err) => {
        this.snackbarService.openSnackBar(err, AppConstant.ERROR_ACTION);
      });
  }

  onDelete(params: any) {
    let index = this.collection.indexOf(params.rowData);
    if (index >= 0) {
      this.openDeleteConfirmationDialog(params);
    }
  }

  onDeleteProduct(element: ProductDetail) {
    this.productService
      .deleteProduct(element.id)
      .then(() => {
        let index = this.collection.indexOf(element);
        if (index >= 0) {
          this.collection.splice(index, 1);
          let array = this.collection.slice();
          this.collection = array;
          this.updateGrid();
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

  openDeleteConfirmationDialog(element: any): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: {
        key: AppConstant.PRODUCT_DELETE,
        object: element.rowData,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.delete == AppConstant.YES_ACTION) {
        console.log(AppConstant.YES_ACTION);
        this.onDeleteProduct(element.rowData);
      } else {
        console.log(AppConstant.NO_ACTION);
      }
    });
  }

  openUpdateConfirmationDialog(element: any): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: {
        key: AppConstant.PRODUCT_UPDATE,
        object: element.rowData,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.delete == AppConstant.YES_ACTION) {
        console.log(AppConstant.YES_ACTION);
        this.onUpdateUser(element);
      } else {
        console.log(AppConstant.NO_ACTION);
      }
    });
  }

  onFetchCompanys() {
    this.companyCollection = [];
    this.productService.getCompany().then((result) => {
      if (result && result.length > 0) {
        this.companyCollection = result;
      } else {
        console.log(AppConstant.COMPANY_NOT_FOUND_MSG);
      }
    });
  }

  onFetchProducts() {
    this.collection = [];
    this.productService.getProducts().then((result) => {
      if (result && result.length > 0) {
        this.collection = result;
      } else {
        console.log(AppConstant.PRODUCT_NOT_FOUND_MSG);
      }
    });
  }

  onCompanySelectionChange(selectedRoute: any) {
    console.log(selectedRoute);
  }
}
