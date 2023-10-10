import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppConstant } from 'src/app/appConstant';
import { DeleteConfirmationDialogComponent } from 'src/app/dialog/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { Route } from 'src/app/models/route';
import { DataEntryService } from 'src/app/services/data-entry.service';
import { RouteService } from 'src/app/services/route.service';

@Component({
  selector: 'app-delete-route',
  templateUrl: './delete-route.component.html',
  styleUrls: ['./delete-route.component.scss'],
})
export class DeleteRouteComponent implements OnInit {
  collection: Route[] = [];
  displayedColumns: string[] = ['routeName', 'Action'];

  constructor(
    public dialog: MatDialog,
    private entryService: DataEntryService,
    private routeService: RouteService
  ) {}

  ngOnInit(): void {
    this.onFetchRoutesDetails();
  }

  onFetchRoutesDetails() {
    this.collection = [];
    this.entryService
      .getRoutes()
      .then((result) => {
        if (result && result.length > 0) {
          this.collection = this.sortData(result);
        } else {
          console.log(AppConstant.ROUTE_NOT_FOUND_MSG);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  sortData(result: Route[]) {
    return result.sort((a, b) => {
      return a.routeName < b.routeName ? -1 : 1;
    });
  }

  onDeleteRoute(element: Route) {
    this.routeService
      .deleteRoute(element.id)
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

  openDeleteConfirmationDialog(element: Route): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      data: { key: AppConstant.ROUTE, value: element.routeName },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.delete == AppConstant.YES_ACTION) {
        console.log(AppConstant.YES_ACTION);
        this.onDeleteRoute(element);
      } else {
        console.log(AppConstant.NO_ACTION);
      }
    });
  }
}
