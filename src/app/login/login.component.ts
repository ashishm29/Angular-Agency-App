import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/authentication';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  hide = true;

  loginFormGroup!: FormGroup;
  loginFailed!: boolean;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.loginFormGroup = new FormGroup({
      mobileNumber: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  onLogin() {
    if (this.loginFormGroup.invalid) {
      console.log('Enter login details');
      return;
    }

    let details = {
      mobileNumber: this.loginFormGroup.value.mobileNumber,
      password: this.loginFormGroup.value.password,
    } as unknown as User;

    this.loginFailed = false;
    this.authService
      .onLogin(details)
      .then((result) => {
        if (result && result.length > 0) {
          this.router.navigate(['/dashboard']);
        } else {
          this.loginFailed = true;
          this.initForm();
        }
      })
      .catch((error) => {
        console.log(error);
        this.loginFailed = true;
        this.initForm();
      });
  }

  // onSignUp() {
  //   let user = {
  //     mobileNumber: this.loginFormGroup.value.mobileNumber,
  //     password: this.loginFormGroup.value.password,
  //     Roles: [
  //       {
  //         RoleId: 100,
  //         RoleName: 'admin',
  //       },
  //     ],
  //   } as unknown as User;

  //   this.authService.onSignUp(user);
  // }
}
