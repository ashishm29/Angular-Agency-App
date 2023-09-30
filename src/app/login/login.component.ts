import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from '../models/authentication';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  hide = true;

  loginFormGroup!: FormGroup;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.loginFormGroup = new FormGroup({
      mobileNumber: new FormControl(),
      password: new FormControl(),
    });
  }

  onLogin() {
    this.authService.onLogin();
  }

  onSignUp() {
    let user = {
      mobileNumber: this.loginFormGroup.value.mobileNumber,
      password: this.loginFormGroup.value.password,
      Roles: [
        {
          RoleId: 100,
          RoleName: 'admin',
        },
      ],
    } as User;

    this.authService.onSignUp(user);
  }
}
