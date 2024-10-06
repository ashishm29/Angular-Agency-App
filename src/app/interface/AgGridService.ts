import { ColDef } from 'ag-grid-community';

export interface IAgGrid {
  frameworkComponents: any;
  collection: any[];
  api: any;
  colDefs: ColDef[];
  defaultColDef: ColDef;
  onGridReady(params: any): any;
  updateGrid(): any;
  setColDefs(colDef: ColDef[]): any;
}
