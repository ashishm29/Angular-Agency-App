import { Injectable } from '@angular/core';
import { Borders, Workbook } from 'ExcelJs';
import { BillDetails } from '../models/route';
import * as FileSaver from 'file-saver';
import { reduce } from 'rxjs';
import { DatePipe } from '@angular/common';
import { AppConstant } from '../appConstant';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  list!: BillDetails;

  workbook = new Workbook();
  worksheet = this.workbook.addWorksheet('Report');

  border: Partial<Borders> = {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' },
  };

  headerFontStyle = { name: 'Times New Roman', size: 15, bold: true };
  footerFontStyle = { name: 'Times New Roman', size: 15, bold: true };
  detailsFontStyle = { name: 'Times New Roman', size: 14 };

  constructor(private datePipe: DatePipe) {}

  ExportExcel(bills: BillDetails[]) {
    let header = [
      'Route',
      'Store Name',
      'Bill Number',
      'Bill Date',
      'Bill Amount',
      'Received Amount',
      'Pending Amount',
    ];

    const headerRow = this.worksheet.addRow(header);
    headerRow.border = this.border;

    headerRow.eachCell((cell) => {
      cell.font = this.headerFontStyle;
    });

    bills.forEach((d) => {
      let values = {
        route: d.route,
        storeName: d.storeName.storeName,
        billNumber: d.billNumber,
        billDate: d.billDate,
        billAmount: d.billAmount,
        receivedAmount: +d.billAmount - +d.pendingAmount,
        pendingAmount: d.pendingAmount,
      };

      let row = this.worksheet.addRow(Object.values(values));
      row.font = this.detailsFontStyle;
      row.border = this.border;
    });

    this.worksheet.columns.forEach(function (column, i) {
      if (column['eachCell']) {
        let maxLength = 20;
        column['eachCell']({ includeEmpty: true }, function (cell) {
          var columnLength = cell.value ? cell.value.toString().length : 20;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });
        column.width = maxLength;
      }
    });

    let totalBillAmt = bills.reduce(
      (prevTotal, newVal) => prevTotal + +newVal.billAmount,
      0
    );
    let totalPendingAmt = bills.reduce(
      (prevTotal, newVal) => +prevTotal + +newVal.pendingAmount,
      0
    );
    let totalReceivedAmt = totalBillAmt - totalPendingAmt;

    let values = {
      route: 'Total :',
      storeName: '',
      billNumber: '',
      billDate: '',
      billAmount: totalBillAmt,
      receivedAmount: totalReceivedAmt,
      pendingAmount: totalPendingAmt,
    };

    let footerRow = this.worksheet.addRow(Object.values(values));
    footerRow.font = this.footerFontStyle;
    footerRow.border = this.border;

    this.workbook.xlsx.writeBuffer().then((excelData) => {
      const blob = new Blob([excelData], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      let currrent_Date = this.datePipe.transform(
        Date.now().toString(),
        AppConstant.DATE_TIME_FORMAT_PLAIN
      );

      FileSaver.saveAs(blob, currrent_Date + '_BillReport.xlsx');
    });
  }
}
