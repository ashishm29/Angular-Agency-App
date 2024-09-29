import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Borders, Workbook, Worksheet } from 'exceljs';
import * as FileSaver from 'file-saver';
import { AppConstant } from 'src/app/appConstant';
import { RecoveryDetails } from 'src/app/models/route';

@Injectable({
  providedIn: 'root',
})
export class RecoveryExcelService {
  list!: RecoveryDetails;
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

  ExportReportExcel(
    records: RecoveryDetails[],
    fromDate: Date | undefined,
    toDate: Date
  ) {
    this.workbook = new Workbook();
    this.worksheet = this.workbook.addWorksheet('Recovery Report');
    this.addFilterRows(fromDate, toDate);

    let header = this.prepareReportHeader();
    this.addHeader(header);

    records.forEach((d: any) => {
      let recoveryDate;
      try {
        recoveryDate = this.datePipe.transform(
          d.recoveryDate.toDate(),
          'dd-MM-yyyy'
        );
      } catch {
        recoveryDate = d.recoveryDate;
      }

      let values = {
        route: d.route,
        storeName: d.storeName.storeName,
        billNumber: d.billNumber,
        billAmount: d.billAmount,
        receiptNumber: d.receiptNumber,
        modeOfPayment:
          d.modeOfPayment === 'Cheque' && d.chequeNo !== undefined
            ? d.modeOfPayment + '/' + d.chequeNo
            : d.modeOfPayment,
        amountReceived: +d.amountReceived,
        recoveryDate: recoveryDate,
        recoveryAgent: d.recoveryAgent,
      };
      this.addDetails(values);
    });

    this.adjustColumnWidth();

    let totalBillAmt = records.reduce(
      (prevTotal, newVal) => prevTotal + +newVal.billAmount,
      0
    );
    let totalPendingAmt = records.reduce(
      (prevTotal, newVal) => +prevTotal + +newVal.pendingAmount,
      0
    );
    let totalReceivedAmt = totalBillAmt - totalPendingAmt;

    let values = {
      route: 'Total :',
      storeName: '',
      billNumber: '',
      billAmount: totalBillAmt,
      receiptNumber: '',
      modeOfPayment: '',
      amountReceived: totalReceivedAmt,
      recoveryDate: '',
      recoveryAgent: '',
    };

    this.addFooter(values);
    this.exportToExcel('_RecoveryReport');
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

  prepareReportHeader() {
    return [
      'Route',
      'Store Name',
      'Bill Number',
      'Bill Amount',
      'Receipt Number',
      'Mode of Payment',
      'Amount Received',
      'Recovery Date',
      'Recovery Agent',
    ];
  }

  addFilterRows(fromDate: Date | undefined, toDate: Date) {
    let row = this.worksheet.addRow([]);
    row = this.worksheet.addRow([
      'FROM DATE : ',
      fromDate ? fromDate!.toDateString() : 'FROM START',
    ]);
    row.getCell(1).font = this.fontWithBoldCell;
    row.getCell(2).font = this.fontWithoutBoldCell;
    row = this.worksheet.addRow(['TO DATE : ', toDate.toDateString()]);
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
