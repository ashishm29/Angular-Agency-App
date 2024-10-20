import { ColDef } from 'ag-grid-community';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  NgForm,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { AppConstant } from 'src/app/appConstant';
import { User } from 'src/app/models/authentication';
import { ButtonRendererComponent } from 'src/app/renderer/button-renderer/button-renderer.component';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { DeleteConfirmationDialogComponent } from 'src/app/dialog/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-salesman-data-entry',
  templateUrl: './salesman-data-entry.component.html',
  styleUrls: ['./salesman-data-entry.component.scss'],
})
export class SalesmanDataEntryComponent implements OnInit {
  formGroup!: UntypedFormGroup;
  @ViewChild('formDirective') private formDirective!: NgForm;
  collection: User[] = [];

  constructor(
    private userService: UserService,
    private snackbarService: SnackBarService,
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
      field: 'username',
      flex: 1,
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
    },
    {
      field: 'role',
      flex: 1.5,
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
    },
    {
      field: 'mobileNumber',
      flex: 1.5,
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
      editable: true,
    },
    {
      field: 'password',
      flex: 1.5,
      minWidth: 200,
      wrapText: true,
      editable: true,
      autoHeight: true,
    },
    {
      field: 'salary',
      flex: 1.5,
      minWidth: 200,
      wrapText: true,
      editable: true,
      autoHeight: true,
    },
    {
      field: 'dateOfJoining',
      flex: 1.5,
      minWidth: 200,
      wrapText: true,
      editable: false,
      autoHeight: true,
      valueGetter: (param: any) => {
        if (!param.data.dateOfJoining) return;
        try {
          return this.datePipe.transform(
            param.data.dateOfJoining.toDate(),
            'dd-MM-yyyy'
          );
        } catch {
          return this.datePipe.transform(
            param.data.dateOfJoining.toString(),
            'dd-MM-yyyy'
          );
        }
      },
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

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    this.formGroup = new UntypedFormGroup({
      username: new UntypedFormControl('', [Validators.required]),
      role: new UntypedFormControl('', [Validators.required]),
      password: new UntypedFormControl('', [Validators.required]),
      salary: new UntypedFormControl('', [Validators.required]),
      dateOfJoining: new UntypedFormControl('', [Validators.required]),
      mobileNumber: new UntypedFormControl('', [
        Validators.required,
        Validators.min(1000000000),
        Validators.max(99999999999),
      ]),
    });

    if (this.formDirective) {
      this.formDirective.resetForm();
    }

    this.getSalesmanDetail();
  }

  onAddUser() {
    let params = {
      ...this.formGroup.value,
      salary: +this.formGroup.value.salary,
      mobileNumber: +this.formGroup.value.mobileNumber,
    } as User;

    this.userService
      .addUser(params)
      .then(() => {
        this.snackbarService.openSnackBar(
          AppConstant.RECORD_ADDED_SUCCESS_MSG,
          AppConstant.SAVE_ACTION
        );
        this.initialize();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onDeleteUser(element: any) {
    this.userService
      .deleteUser(element.rowData.id)
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

  onUpdateUser(param: any) {
    this.userService
      .updateUser(param.rowData)
      .then(() => {
        this.snackbarService.openSnackBar(
          AppConstant.RECORD_UPDATED_SUCCESS_MSG,
          AppConstant.UPDAE_ACTION
        );
        this.getSalesmanDetail();
      })
      .catch((err) => {
        this.snackbarService.openSnackBar(err, AppConstant.ERROR_ACTION);
      });
  }

  getSalesmanDetail() {
    this.collection = [];
    this.userService
      .getSalesmanList()
      .then((records) => {
        this.collection = records;
      })
      .catch((err) => {
        this.snackbarService.openSnackBar(err, AppConstant.ERROR_ACTION);
      });
  }

  openDeleteConfirmationDialog(element: any): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: {
        key: AppConstant.USER_DELETE,
        object: element.rowData,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.delete == AppConstant.YES_ACTION) {
        console.log(AppConstant.YES_ACTION);
        this.onDeleteUser(element);
      } else {
        console.log(AppConstant.NO_ACTION);
      }
    });
  }

  openUpdateConfirmationDialog(element: any): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: {
        key: AppConstant.USER_UPDATE,
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
}
