import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppConstant } from 'src/app/appConstant';
import { Route } from 'src/app/models/route';
import { DataEntryService } from 'src/app/services/data-entry.service';

@Component({
  selector: 'app-edit-route-details',
  templateUrl: './edit-route-details.component.html',
  styleUrls: ['./edit-route-details.component.scss'],
})
export class EditRouteDetailsComponent implements OnInit {
  routeFormGroup!: FormGroup;
  routeName!: string;
  routeCollection: Route[] = [];
  selectedRouteToUpdate!: Route;

  constructor(
    public entryService: DataEntryService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.initializeRouteUiFields();
    this.onFetchRoute();
  }

  initializeRouteUiFields() {
    this.routeFormGroup = new FormGroup({
      route: new FormControl('', [Validators.required]),
    });
  }

  onFetchRoute() {
    this.routeCollection = [];
    this.entryService.getRoutes().then((result) => {
      if (result && result.length > 0) {
        this.routeCollection = result;
      } else {
        console.log(AppConstant.ROUTE_NOT_FOUND_MSG);
      }
    });
  }

  routeSelectionChange(selectedVal: string) {
    console.log(selectedVal);
    if (selectedVal) {
      this.routeFormGroup.patchValue({
        route: selectedVal,
      });

      let routeObj = this.routeCollection.find(
        (c) => c.routeName == selectedVal
      ) as Route;

      if (routeObj) {
        this.selectedRouteToUpdate = routeObj;
      } else {
        this.selectedRouteToUpdate = {} as Route;
      }
    }
  }

  onUpdateRoute() {
    if (this.routeFormGroup.invalid || !this.selectedRouteToUpdate) {
      console.log('route form is invalid');
      return;
    }

    let route = {
      ...(this.selectedRouteToUpdate as Route),
      routeName: this.routeFormGroup.value.route,
      updatedDate: this.datePipe.transform(
        Date.now().toString(),
        AppConstant.DATE_TIME_FORMAT
      ),
    } as Route;

    const newLocal = this;
    newLocal.entryService
      .updateRoute(route)
      .then(() => {
        console.log(AppConstant.ROUTE_UPDATED_SUCCESS_MSG);
        this.openSnackBar(
          AppConstant.ROUTE_UPDATED_SUCCESS_MSG,
          AppConstant.UPDAE_ACTION
        );
        this.initializeRouteUiFields();
        this.onFetchRoute();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }
}
