import { Component, OnInit } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import {
  ICellEditorAngularComp,
  ICellRendererAngularComp,
  IDateAngularComp,
} from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid-community';

@Component({
  selector: 'app-date-picker-renderer',
  templateUrl: './date-picker-renderer.component.html',
  styleUrls: ['./date-picker-renderer.component.scss'],
})
export class DatePickerRendererComponent implements ICellRendererAngularComp {
  params!: any;
  absentDays!: string[];
  selectedDate!: FormControl;
  gridApi: any;
  agInit(params: any): void {
    this.params = params;
    this.absentDays = this.params.data.absentDayList || null;
    // this.selectedDate = new FormControl(Timestamp.now().toDate());
    this.selectedDate = new FormControl(this.params.data.absentDate);
    this.gridApi = this.params.gridApi;
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highligh dates inside the month view.
    if (view === 'month') {
      const date = cellDate.toDateString();
      let result = this.absentDays.includes(date);
      return result ? 'example-custom-date-class' : '';
    }

    return '';
  };

  refresh(params?: any): boolean {
    console.log('Date refresh : ' + params);
    return true;
  }

  onChange($event: any) {
    if (this.params.onChange instanceof Function) {
      console.log('Date onChange :' + this.selectedDate.value);
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        rowData: {
          ...this.params.node.data,
          SelectedDate: this.selectedDate.value,
        },
      };

      this.params.onChange(params);
    }
  }

  onRemoveSelected(params: any) {
    console.log('onRemoveSelected :' + params);
  }
}
