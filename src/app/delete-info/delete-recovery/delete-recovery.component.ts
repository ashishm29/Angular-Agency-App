import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppConstant } from 'src/app/appConstant';
import { DeleteConfirmationDialogComponent } from 'src/app/dialog/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { RecoveryDetails } from 'src/app/models/route';
import { DataEntryService } from 'src/app/services/data-entry.service';
import { RecoveryService } from 'src/app/services/recovery.service';
import { StoreService } from 'src/app/services/store.service';

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
    'amountReceived',
    'receiptNumber',
    'Action',
  ];

  constructor(
    public dialog: MatDialog,
    private entryService: DataEntryService,
    private recoveryService: RecoveryService
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

  onDeleteStore(element: RecoveryDetails) {
    this.recoveryService
      .deleteRecovery(element.id)
      .then(() => {
        let index = this.collection.indexOf(element);
        if (index >= 0) {
          this.collection.splice(index, 1);
          let array = this.collection.slice();
          this.collection = array;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  openDeleteConfirmationDialog(element: RecoveryDetails): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { key: AppConstant.RECOVERY, value: element.receiptNumber },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.delete == AppConstant.YES_ACTION) {
        console.log(AppConstant.YES_ACTION);
        this.onDeleteStore(element);
      } else {
        console.log(AppConstant.NO_ACTION);
      }
    });
  }
}
