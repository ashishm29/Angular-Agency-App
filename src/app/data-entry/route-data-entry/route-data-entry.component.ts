import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { AppConstant } from 'src/app/appConstant';
import { Route } from 'src/app/models/route';
import { RouteService } from 'src/app/services/route.service';
import { SnackBarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-route-data-entry',
  templateUrl: './route-data-entry.component.html',
  styleUrls: ['./route-data-entry.component.scss'],
})
export class RouteDataEntryComponent implements OnInit {
  routeFormGroup!: FormGroup;
  @ViewChild('routeFormDirective') private routeFormDirective!: NgForm;

  constructor(
    private routeService: RouteService,
    private datePipe: DatePipe,
    private snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    this.routeFormGroup = new FormGroup({
      route: new FormControl('', [Validators.required]),
    });

    if (this.routeFormDirective) {
      this.routeFormDirective.resetForm();
    }
  }

  onAddRoute() {
    if (this.routeFormGroup.invalid) {
      console.log('route form is invalid');
      return;
    }

    let route = {
      routeName: this.routeFormGroup.value.route,
      createdDate: this.datePipe.transform(
        Date.now().toString(),
        AppConstant.DATE_TIME_FORMAT
      ),
    } as Route;

    const newLocal = this;
    newLocal.routeService
      .addRoute(route)
      .then(() => {
        console.log(AppConstant.ROUTE_ADDED_SUCCESS_MSG);
        this.snackbarService.openSnackBar(
          AppConstant.ROUTE_ADDED_SUCCESS_MSG,
          AppConstant.SAVE_ACTION
        );
        this.initialize();
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
