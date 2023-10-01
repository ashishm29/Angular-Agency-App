import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Role, User } from '../models/authentication';

@Component({
  selector: 'app-login-details',
  templateUrl: './login-details.component.html',
  styleUrls: ['./login-details.component.scss'],
})
export class LoginDetailsComponent implements OnInit {
  constructor(public authService: AuthService) {}

  userCollection: User[] = [];
  userDetail: User[] = [];
  displayedColumns: string[] = ['mobileNumber', 'password'];

  ngOnInit(): void {
    this.onGetDetail();
  }

  onGetDetail() {
    this.authService.onFetchLoginDetails().then((result) => {
      this.userDetail = result as User[];
      this.userCollection = this.userDetail;
    });
  }

  onUpdate(user: User) {
    this.authService.onUpdateLoginDetails(user);
  }

  onDelete(user: User) {
    this.authService.onDelete(user);
  }
}
