import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-dropdown-renderer',
  templateUrl: './dropdown-renderer.component.html',
  styleUrls: ['./dropdown-renderer.component.scss'],
})
export class DropdownRendererComponent implements ICellEditorAngularComp {
  private params: any;
  public value!: string;
  public values!: any[];

  @ViewChild('dropdown', { static: true }) dropdown!: ElementRef;

  agInit(params: any): void {
    this.params = params;
    this.value = this.params.value;
    this.values = this.params.values;
  }

  getValue(): any {
    return this.value;
  }

  onChange(event: any): void {
    this.value = event.target.value;
  }
}
