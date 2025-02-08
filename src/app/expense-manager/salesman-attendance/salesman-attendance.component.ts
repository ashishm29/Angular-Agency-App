import { ColDef } from 'ag-grid-community';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ExpenseService } from 'src/app/services/expense.service';
import { AppConstant } from 'src/app/appConstant';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { ButtonRendererComponent } from 'src/app/renderer/button-renderer/button-renderer.component';
import { DatePickerRendererComponent } from 'src/app/renderer/date-picker-renderer/date-picker-renderer.component';
import { UserService } from 'src/app/services/user.service';
import { Attendance } from 'src/app/models/route';
import { DatePipe } from '@angular/common';
import { DeleteConfirmationDialogComponent } from 'src/app/dialog/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-salesman-salary',
  templateUrl: './salesman-attendance.component.html',
  styleUrls: ['./salesman-attendance.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SalesmanAttendanceComponent implements OnInit {
  collection: Attendance[] = [];
  tempAttendanceCollection: Attendance[] = [];
  salesmanCollection: Attendance[] = [];
  yearCollection: number[] = [];
  monthCollection: { monthNumber: number; monthName: string }[] = [
    { monthNumber: 1, monthName: '1- JAN' },
    { monthNumber: 2, monthName: '2 - FEB' },
    { monthNumber: 3, monthName: '3 - MAR' },
    { monthNumber: 4, monthName: '4 - APR' },
    { monthNumber: 5, monthName: '5 - MAY' },
    { monthNumber: 6, monthName: '6 - JUN' },
    { monthNumber: 7, monthName: '7 - JUL' },
    { monthNumber: 8, monthName: '8 - AUG' },
    { monthNumber: 9, monthName: '9 - SEP' },
    { monthNumber: 10, monthName: '10 - OCT' },
    { monthNumber: 11, monthName: '11 - NOV' },
    { monthNumber: 12, monthName: '12 - DEC' },
  ];
  selectedMonth!: FormControl;
  selectedYear!: FormControl;

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

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

  colDefsSalesman: ColDef[] = [
    {
      field: 'salesman',
      flex: 1,
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
      floatingFilter: true,
    },
    {
      field: 'salary',
      flex: 0.6,
      minWidth: 200,
      wrapText: true,
      editable: false,
      autoHeight: true,
    },
    {
      field: 'dateOfJoining',
      flex: 1,
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
      field: 'salaryToPay',
      flex: 1,
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
    },
    {
      headerName: 'Total Absent Days',
      field: 'totalAbsentDays',
      flex: 1,
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
    },
    {
      headerName: 'Select Absent Date',
      field: 'absentDate',
      flex: 1,
      minWidth: 300,
      cellRenderer: 'datePickerRenderer',
      cellRendererParams: {
        onChange: this.onChange.bind(this),
        gridApi: this.api,
      },
      valueGetter: (params) => {
        return params.data.absentDayList;
      },
    },
    {
      headerName: 'Comment',
      field: 'comment',
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
        onClick: this.onClick.bind(this),
        label: 'Mark Absent',
      },
    },
  ];

  colDefs: ColDef[] = [
    {
      field: 'salesman',
      flex: 1.5,
      minWidth: 200,
      wrapText: true,
      editable: false,
      autoHeight: true,
      floatingFilter: true,
    },
    {
      field: 'absentDate',
      flex: 1.5,
      minWidth: 200,
      wrapText: true,
      editable: false,
      autoHeight: true,
      valueGetter: (param) => {
        return this.datePipe.transform(
          param.data.absentDate.toDate(),
          'dd-MM-yyyy'
        );
      },
    },
    {
      headerName: 'Comment',
      field: 'comment',
      flex: 1.5,
      minWidth: 200,
      wrapText: true,
      autoHeight: true,
    },
    {
      headerName: 'Delete Attendance',
      minWidth: 120,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.openDeleteConfirmationDialog.bind(this),
        label: 'Delete',
      },
    },
  ];

  onChange(params: any) {
    let salesman = params.rowData.salesman;
    if (salesman) {
      this.salesmanCollection.forEach((item) => {
        if (item.salesman === salesman) {
          item.absentDate = params.rowData.SelectedDate;
        }
      });
    }
  }

  onClick(params: any) {
    let details = {
      salesman: params.rowData.salesman,
      createdDate: new Date(),
      absentDate: params.rowData.absentDate,
      comment: params.rowData.comment,
    } as any;

    let filteredRecord = this.collection.filter(
      (c) =>
        c.salesman === details.salesman &&
        c.absentDate.toDate().toDateString() ===
          details.absentDate.toDateString()
    );

    if (filteredRecord && filteredRecord.length > 0) {
      this.snackbarService.openSnackBar(
        AppConstant.RECORD_ALREADY_PRESENT_MSG,
        AppConstant.SAVE_ACTION
      );
    } else {
      this.openConfirmationDialog(details);
    }
  }

  onGridReady(params: any) {
    this.api = params.api;
  }
  constructor(
    private expenseService: ExpenseService,
    private snackbarService: SnackBarService,
    private userService: UserService,
    private datePipe: DatePipe,
    public dialog: MatDialog
  ) {
    this.frameworkComponents = {
      datePickerRenderer: DatePickerRendererComponent,
      buttonRenderer: ButtonRendererComponent,
    };
    let date = new Date();

    let startYear = date.getFullYear() - 5;

    let formYearCollection: number[] = [];
    for (let i = startYear; i <= date.getFullYear(); i++) {
      formYearCollection.push(i);
    }
    this.yearCollection = formYearCollection;

    this.selectedMonth = new FormControl((date.getMonth() + 1).toString());
    this.selectedYear = new FormControl(date.getFullYear().toString());
  }

  ngOnInit(): void {
    this.getRecords();
  }

  addRecord(params: any) {
    this.expenseService
      .add(params)
      .then(() => {
        this.snackbarService.openSnackBar(
          AppConstant.RECORD_ADDED_SUCCESS_MSG,
          AppConstant.SAVE_ACTION
        );
      })
      .catch((err) => {
        console.log(err);
      });

    return true;
  }

  async getRecords() {
    this.collection = [];
    this.tempAttendanceCollection = [];
    await this.expenseService.get().then((result) => {
      if (result && result.length > 0) {
        let currentMonthAbsentList = result.filter(
          (c) =>
            c.absentDate.toDate().getMonth() ===
              +this.selectedMonth.value - 1 &&
            c.absentDate.toDate().getFullYear() === +this.selectedYear.value
        );
        this.collection = currentMonthAbsentList;
        this.tempAttendanceCollection = result;
        this.getSalesmanDetail();
      } else {
        this.getSalesmanDetail();
      }
    });
  }

  async getDateFilterWiseRecords() {
    this.collection = [];
    await this.expenseService.get().then((result) => {
      if (result && result.length > 0) {
        let absentList = result.filter(
          (c) =>
            c.absentDate.toDate() >= this.range.value.start! &&
            c.absentDate.toDate() <= this.range.value.end!
        );
        this.collection = absentList;
      }
    });
  }

  async getSalesmanDetail() {
    this.salesmanCollection = [];
    this.userService.getSalesmanList().then((records) => {
      if (records && records.length > 0) {
        let attendance: any[] = [];
        let salesman = records.filter((c) => c.role == 'salesman');
        for (let i = 0; i < salesman.length; i++) {
          let records = this.collection.filter(
            (item) => item.salesman === salesman[i].username
          );

          let days: string[] = [];
          records.forEach((item) => {
            days.push(item.absentDate.toDate().toDateString());
          });

          let currentDate = new Date();
          let daysInMonths = this.daysInMonth(
            currentDate.getMonth() + 1,
            currentDate.getFullYear()
          );

          let empSal = salesman[i].salary;
          let perdaySal = empSal / daysInMonths;
          let dueSal = Math.round(perdaySal * (daysInMonths - days.length));

          let defaultDate = new Date();
          defaultDate.setMonth(+this.selectedMonth.value - 1);
          defaultDate.setFullYear(+this.selectedYear.value);

          attendance.push({
            salesman: salesman[i].username,
            absentDayList: days,
            totalAbsentDays: days.length,
            absentDate: defaultDate,
            salary: salesman[i].salary,
            salaryToPay: dueSal,
            comment: '',
            dateOfJoining: salesman[i].dateOfJoining,
          } as any);
        }

        this.salesmanCollection = attendance;
      }
    });
  }

  daysInMonth(month: any, year: any) {
    // Use 1 for January, 2 for February, etc.
    return new Date(year, month, 0).getDate();
  }

  openConfirmationDialog(details: any): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { key: AppConstant.ATTENDANCE, object: details },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result && result.delete == AppConstant.YES_ACTION) {
        console.log(AppConstant.YES_ACTION);
        if (await this.addRecord(details)) {
          this.getRecords();
        }
      } else {
        console.log(AppConstant.NO_ACTION);
      }
    });
  }

  onSelectionChange(value: string, controlName: string) {
    if (value && controlName) {
      let date = new Date();
      date.setMonth(this.selectedMonth.value - 1);
      date.setFullYear(this.selectedYear.value);

      let currentMonthAbsentList = this.tempAttendanceCollection.filter(
        (c) =>
          c.absentDate.toDate().getMonth() === date.getMonth() &&
          c.absentDate.toDate().getFullYear() === date.getFullYear()
      );

      this.collection = currentMonthAbsentList;
      this.getSalesmanDetail();
      this.range.reset();
    }
  }

  onSearch() {
    if (this.range.value.start && this.range.value.end) {
      this.getDateFilterWiseRecords();
    } else {
      this.snackbarService.openSnackBar(
        AppConstant.ENTER_VALID_DATES_MSG,
        AppConstant.SEARCH_ACTION
      );
    }
  }

  openDeleteConfirmationDialog(element: any): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: {
        key: AppConstant.ATTENDANCE_DELETE,
        object: element.rowData,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.delete == AppConstant.YES_ACTION) {
        console.log(AppConstant.YES_ACTION);
        this.onDeleteAttendanceClick(element);
      } else {
        console.log(AppConstant.NO_ACTION);
      }
    });
  }

  onDeleteAttendanceClick(record: any) {
    let element = record.rowData;
    this.expenseService
      .deleteAttendance(element.id)
      .then(() => {
        let index = this.collection.indexOf(element);
        if (index >= 0) {
          this.collection.splice(index, 1);
          let array = this.collection.slice();
          this.collection = array;
          this.api.updateGridOptions({ rowData: this.collection });
          this.getRecords();
        }
      })
      .catch((err) => {
        console.log(err);
        this.snackbarService.openSnackBar(err, AppConstant.ERROR_ACTION);
      });
  }
}
