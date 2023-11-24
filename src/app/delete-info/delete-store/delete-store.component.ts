import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppConstant } from 'src/app/appConstant';
import { DeleteConfirmationDialogComponent } from 'src/app/dialog/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { StoreDetails } from 'src/app/models/route';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-delete-store',
  templateUrl: './delete-store.component.html',
  styleUrls: ['./delete-store.component.scss'],
})
export class DeleteStoreComponent implements OnInit {
  collection: StoreDetails[] = [];
  displayedColumns: string[] = [
    'route',
    'storeName',
    'address',
    'mobileNumber',
    'Action',
  ];

  constructor(
    public dialog: MatDialog,
    private storeService: StoreService,
    private snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.onFetchStoreDetails();
  }

  onFetchStoreDetails() {
    this.collection = [];
    this.storeService
      .getStores('')
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

  sortData(result: StoreDetails[]) {
    return result.sort((a, b) => {
      if (a.route === b.route) {
        return a.storeName < b.storeName ? -1 : 1;
      } else {
        return a.route < b.route ? -1 : 1;
      }
    });
  }

  onDeleteStore(element: StoreDetails) {
    this.storeService
      .deleteStore(element.id)
      .then(() => {
        let index = this.collection.indexOf(element);
        if (index >= 0) {
          this.collection.splice(index, 1);
          let array = this.collection.slice();
          this.collection = array;
        }

        this.snackbarService.openSnackBar(
          AppConstant.STORE_DELETED_SUCCESS_MSG,
          AppConstant.DELETE_ACTION
        );
      })
      .catch((err) => {
        console.log(err);
        this.snackbarService.openSnackBar(err, AppConstant.ERROR_ACTION);
      });
  }

  openDeleteConfirmationDialog(element: StoreDetails): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { key: AppConstant.STORE, value: element.storeName },
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
