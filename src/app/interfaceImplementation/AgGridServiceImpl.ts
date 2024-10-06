import { ColDef } from 'ag-grid-community';
import { ButtonRendererComponent } from '../renderer/button-renderer/button-renderer.component';
import { IAgGrid as AgGridService } from '../interface/AgGridService';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export abstract class AgGridServiceImpl implements AgGridService {
  frameworkComponents: any;
  collection!: any[];
  api!: any;
  colDefs!: ColDef[];

  constructor() {
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    };
  }

  gridOptions = {
    suppressRowHoverHighlight: false,
    columnHoverHighlight: false,
    pagination: false,
    paginationPageSize: 50,
    suppressHorizontalScroll: false,
    alwaysShowHorizontalScroll: true,
    suppressContextMenu: false,
  };

  public defaultColDef: ColDef = {
    editable: false,
    filter: true,
  };

  onGridReady(params: any) {
    this.api = params.api;
  }

  updateGrid() {
    this.api.updateGridOptions({ rowData: this.collection });
  }

  setColDefs(colDef: ColDef[]) {
    this.colDefs = colDef;
  }
}
