import { Component, EventEmitter, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-ag-grid-menu-renderer',
  templateUrl: './ag-grid-menu-renderer.component.html',
  styleUrls: ['./ag-grid-menu-renderer.component.scss'],
})
export class AgGridMenuRendererComponent implements ICellRendererAngularComp {
  params: any;
  callbackFunction: any;

  agInit(params: any): void {
    this.params = params;
    this.callbackFunction = params.callBack;
  }

  refresh(params: any): boolean {
    return false;
  }

  onMenuItemClick(action: string) {
    // Perform your desired action based on the menu item clicked
    this.callbackFunction.emit({ action: action, value: this.params.data });
  }
}
