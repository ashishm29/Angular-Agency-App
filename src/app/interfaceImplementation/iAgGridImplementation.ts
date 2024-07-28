import { ColDef } from 'ag-grid-community';
import { ButtonRendererComponent } from '../renderer/button-renderer/button-renderer.component';
import { IAgGrid } from '../interface/iagGrid';
import { Inject } from '@angular/core';

@Inject
export class iAgGridImplementation implements IAgGrid {
  frameworkComponents: any;
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
  };

  public defaultColDef: ColDef = {
    editable: false,
    filter: true,
  };

  onGridReady(params: any) {
    this.api = params.api;
  }

  updateGrid() {
    //this.api.updateGridOptions({ rowData: this.collection });
  }

  setColDefs(colDef: ColDef[]) {
    this.colDefs = colDef;
  }
}
