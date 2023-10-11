import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppConstant } from 'src/app/appConstant';
import { DeleteConfirmationDialogComponent } from 'src/app/dialog/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { BillDetails, RecoveryDetails } from 'src/app/models/route';
import { BillService } from 'src/app/services/bill.service';
import { RecoveryService } from 'src/app/services/recovery.service';
import { SnackBarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-delete-recovery',
  templateUrl: './delete-recovery.component.html',
  styleUrls: ['./delete-recovery.component.scss'],
})
export class DeleteRecoveryComponent implements OnInit {
  collection: RecoveryDetails[] = [];
  displayedColumns: string[] = [
    'route',
    'storeName',
    'address',
    'billNumber',
    'amountReceived',
    'receiptNumber',
    'Action',
  ];

  constructor(
    public dialog: MatDialog,
    private recoveryService: RecoveryService,
    private billService: BillService,
    private snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.onFetchRecoveryDetails();
  }

  onFetchRecoveryDetails() {
    this.collection = [];
    this.recoveryService
      .getRecoveryDetails()
      .then((result) => {
        if (result && result.length > 0) {
          this.collection = this.sortData(result);
        } else {
          console.log(AppConstant.STORE_NOT_FOUND_MSG);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  sortData(result: RecoveryDetails[]) {
    return result
      .sort((a, b) => {
        return a.route < b.route ? -1 : 1;
      })
      .sort((a, b) => {
        return a.storeName < b.storeName ? -1 : 1;
      });
  }

  onDelete(element: RecoveryDetails) {
    this.recoveryService
      .deleteRecovery(element.id)
      .then(() => {
        let index = this.collection.indexOf(element);
        if (index >= 0) {
          this.collection.splice(index, 1);
          let array = this.collection.slice();
          this.collection = array;
          this.updateBillPendingAmount(element);
        }
      })
      .catch((err) => {
        console.log(err);
        this.snackbarService.openSnackBar(err, AppConstant.ERROR_ACTION);
      });
  }

  updateBillPendingAmount(element: RecoveryDetails) {
    this.billService
      .getFilteredBills('', '', '', '', element.billNumber)
      .then((result) => {
        if (result && result.length > 0) {
          let billobj = {
            ...result[0],
            pendingAmount: result[0].pendingAmount + +element.amountReceived,
          } as BillDetails;

          this.billService
            .updateBillPendingAmount(billobj)
            .then(() => {
              this.snackbarService.openSnackBar(
                AppConstant.BILL_UPDATED_SUCCESS_MSG,
                AppConstant.UPDAE_ACTION
              );
              console.log('Bill updated successfully...');
            })
            .catch((err) => {
              console.log(err);
              this.snackbarService.openSnackBar(err, AppConstant.ERROR_ACTION);
            });
        } else {
          console.log('No bill found...');
        }
      })
      .catch((err) => {
        console.log(err);
        this.snackbarService.openSnackBar(err, AppConstant.ERROR_ACTION);
      });
  }

  openDeleteConfirmationDialog(element: RecoveryDetails): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { key: AppConstant.RECOVERY, value: element.receiptNumber },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.delete == AppConstant.YES_ACTION) {
        console.log(AppConstant.YES_ACTION);
        this.onDelete(element);
      } else {
        console.log(AppConstant.NO_ACTION);
      }
    });
  }
}
