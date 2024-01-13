import { Component, OnInit, ViewChild } from '@angular/core';
import {
  NgForm,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { AppConstant } from 'src/app/appConstant';
import { User } from 'src/app/models/authentication';
import { SnackBarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-salesman-data-entry',
  templateUrl: './salesman-data-entry.component.html',
  styleUrls: ['./salesman-data-entry.component.scss'],
})
export class SalesmanDataEntryComponent implements OnInit {
  formGroup!: UntypedFormGroup;
  @ViewChild('formDirective') private formDirective!: NgForm;

  constructor(
    private userService: UserService,
    private snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    this.formGroup = new UntypedFormGroup({
      username: new UntypedFormControl('', [Validators.required]),
      role: new UntypedFormControl('', [Validators.required]),
      password: new UntypedFormControl('', [Validators.required]),
      salary: new UntypedFormControl('', [Validators.required]),
      mobileNumber: new UntypedFormControl('', [
        Validators.required,
        Validators.min(1000000000),
        Validators.max(99999999999),
      ]),
    });

    if (this.formDirective) {
      this.formDirective.resetForm();
    }
  }

  onAddUser() {
    let params = {
      ...this.formGroup.value,
      salary: +this.formGroup.value.salary,
    } as User;

    this.userService
      .addUser(params)
      .then(() => {
        this.snackbarService.openSnackBar(
          AppConstant.RECORD_ADDED_SUCCESS_MSG,
          AppConstant.SAVE_ACTION
        );
        this.initialize();
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
