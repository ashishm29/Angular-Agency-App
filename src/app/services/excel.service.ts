import { Injectable } from '@angular/core';
import { Borders, Workbook, Worksheet } from 'exceljs';
import { BillDetails } from '../models/route';
import * as FileSaver from 'file-saver';
import { DatePipe } from '@angular/common';
import { AppConstant } from '../appConstant';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  list!: BillDetails;
  workbook!: Workbook;
  worksheet!: Worksheet;

  border: Partial<Borders> = {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' },
  };

  headerFontStyle = {
    name: AppConstant.REPORT_FONT_NAME,
    size: 15,
    bold: true,
  };
  footerFontStyle = {
    name: AppConstant.REPORT_FONT_NAME,
    size: 15,
    bold: true,
  };
  detailsFontStyle = { name: AppConstant.REPORT_FONT_NAME, size: 14 };

  fontWithBoldCell = {
    name: AppConstant.REPORT_FONT_NAME,
    size: 14,
    bold: true,
  };
  fontWithoutBoldCell = { name: AppConstant.REPORT_FONT_NAME, size: 14 };

  constructor(private datePipe: DatePipe) {}

  ExportBillReportExcel(
    bills: BillDetails[],
    fromDate: string,
    toDate: string
  ) {
    this.workbook = new Workbook();
    this.worksheet = this.workbook.addWorksheet('Bill Report');
    this.addFilterRows(fromDate, toDate);

    let header = this.prepareBillReportHeader();
    this.addHeader(header);

    bills.forEach((d) => {
      let billdate;
      try {
        billdate = this.datePipe.transform(d.billDate.toDate(), 'dd-MM-yyyy');
      } catch {
        billdate = d.billDate;
      }

      let values = {
        route: d.route,
        storeName: d.storeName.storeName,
        billNumber: d.billNumber,
        billDate: billdate,
        billAmount: d.billAmount,
        receivedAmount: +d.billAmount - +d.pendingAmount,
        pendingAmount: d.pendingAmount,
      };
      this.addDetails(values);
    });

    this.adjustColumnWidth();

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

    this.addFooter(values);
    this.exportToExcel('_BillReport');
  }

  exportToExcel(fileName: string) {
    this.workbook.xlsx.writeBuffer().then((excelData) => {
      const blob = new Blob([excelData], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      let currrent_Date = this.datePipe.transform(
        Date.now().toString(),
        AppConstant.DATE_TIME_FORMAT_PLAIN
      );

      FileSaver.saveAs(blob, currrent_Date + fileName + '.xlsx');
    });
  }

  prepareBillReportHeader() {
    return [
      'Route',
      'Store Name',
      'Bill Number',
      'Bill Date',
      'Bill Amount',
      'Received Amount',
      'Pending Amount',
    ];
  }

  addFilterRows(fromDate: string, toDate: string) {
    let row = this.worksheet.addRow([]);
    row = this.worksheet.addRow(['FROM DATE : ', fromDate]);
    row.getCell(1).font = this.fontWithBoldCell;
    row.getCell(2).font = this.fontWithoutBoldCell;
    row = this.worksheet.addRow(['TO DATE : ', toDate]);
    row.getCell(1).font = this.fontWithBoldCell;
    row.getCell(2).font = this.fontWithoutBoldCell;
    row = this.worksheet.addRow([]);
  }

  addHeader(header: string[]) {
    const headerRow = this.worksheet.addRow(header);
    headerRow.border = this.border;

    headerRow.eachCell((cell) => {
      cell.font = this.headerFontStyle;
    });

    headerRow.fill = {
      type: 'gradient',
      gradient: 'angle',
      degree: 0,
      stops: [
        { position: 0, color: { argb: 'FFD3D3D3' } },
        { position: 1, color: { argb: 'FFD3D3D3' } },
      ],
    };
  }

  addDetails(values: any) {
    let row = this.worksheet.addRow(Object.values(values));
    row.font = this.detailsFontStyle;
    row.border = this.border;
  }

  addFooter(values: any) {
    let footerRow = this.worksheet.addRow(Object.values(values));
    footerRow.font = this.footerFontStyle;
    footerRow.border = this.border;
  }

  adjustColumnWidth() {
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
  }
}
