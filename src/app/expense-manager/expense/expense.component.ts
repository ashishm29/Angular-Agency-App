import { ColDef } from 'ag-grid-community';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { AppConstant } from 'src/app/appConstant';
import { Expense } from 'src/app/models/route';
import { ExpenseService } from 'src/app/services/expense.service';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { ButtonRendererComponent } from 'src/app/renderer/button-renderer/button-renderer.component';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
})
export class ExpenseComponent implements OnInit {
  formGroup!: FormGroup;
  collection: Expense[] = [];
  @ViewChild('formDirective') private formDirective!: NgForm;

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
  };

  colDefs: ColDef[] = [
    {
      field: 'reason',
      flex: 1,
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
    },
    {
      field: 'comment',
      flex: 1.5,
      minWidth: 200,
      wrapText: true,
      editable: false,
      autoHeight: true,
    },
    {
      field: 'amount',
      flex: 1.5,
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
    },
    {
      headerName: 'Edit',
      minWidth: 100,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.onEdit.bind(this),
        label: 'Edit',
      },
    },
    {
      headerName: 'Delete',
      minWidth: 100,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.onDelete.bind(this),
        label: 'Delete',
      },
    },
  ];

  constructor(
    private expenseService: ExpenseService,
    private snackbarService: SnackBarService
  ) {
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    };
    this.initForm();
    this.getRecords();
  }

  initForm() {
    this.formGroup = new FormGroup({
      reason: new FormControl('', Validators.required),
      comment: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
    });

    if (this.formDirective) {
      this.formDirective.resetForm();
    }
  }

  ngOnInit(): void {}

  onGridReady(params: any) {
    this.api = params.api;
  }

  onSubmit() {
    if (this.formGroup.valid) {
      this.addRecord(this.formGroup.value);
    }
  }

  onEdit(params: any) {}
  onDelete(params: any) {}

  addRecord(params: any) {
    this.expenseService
      .addExpense(params)
      .then(() => {
        this.snackbarService.openSnackBar(
          AppConstant.RECORD_ADDED_SUCCESS_MSG,
          AppConstant.SAVE_ACTION
        );
        this.getRecords();
        this.initForm();
      })
      .catch((err) => {
        console.log(err);
      });

    return true;
  }

  getRecords() {
    this.collection = [];
    this.expenseService.getExpense().then((result) => {
      if (result && result.length > 0) {
        this.collection = result;
      }
    });
  }
}
