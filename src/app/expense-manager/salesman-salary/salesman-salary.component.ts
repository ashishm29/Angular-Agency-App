import { ColDef } from 'ag-grid-community';
import { Component, OnInit } from '@angular/core';
import { Expense } from 'src/app/models/route';

@Component({
  selector: 'app-salesman-salary',
  templateUrl: './salesman-salary.component.html',
  styleUrls: ['./salesman-salary.component.scss'],
})
export class SalesmanSalaryComponent implements OnInit {
  collection: Expense[] = [];

  frameworkComponents: any;
  api: any;
  gridOptions = {
    suppressRowHoverHighlight: false,
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
      field: 'salesman',
      flex: 1.5,
      minWidth: 200,
      wrapText: true,
      editable: false,
      autoHeight: true,
    },
    {
      field: 'absendDays',
      flex: 1.5,
      minWidth: 200,
      wrapText: true,
      editable: false,
      autoHeight: true,
    },
    {
      field: 'pendingAmount',
      flex: 1.5,
      minWidth: 200,
      wrapText: true,
      editable: false,
      autoHeight: true,
    },
  ];

  onGridReady(params: any) {
    this.api = params.api;
  }
  constructor() {}

  ngOnInit(): void {}
}
