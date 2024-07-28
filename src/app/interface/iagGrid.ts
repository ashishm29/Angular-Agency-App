import { ColDef } from "ag-grid-community";

export interface IAgGrid {
  frameworkComponents: any;
  api: any;
  colDefs: ColDef[];
  onGridReady(params: any): any;
  updateGrid(): any;
  setColDefs(colDef: ColDef[]) : any;
}
