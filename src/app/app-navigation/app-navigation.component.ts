import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { User } from '../models/authentication';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-app-navigation',
  templateUrl: './app-navigation.component.html',
  styleUrls: ['./app-navigation.component.scss'],
})
export class AppNavigationComponent implements OnInit {
  isAuthenticate!: boolean;
  isAdmin!: boolean;
  drawerObj!: MatSidenav;
  username!: string;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.authService.userSubject.subscribe((userdata: User) => {
      if (userdata) {
        this.isAuthenticate = true;
        this.isAdmin = this.authService.isAdmin();
        this.username = 'Welcome - ' + userdata.username;
        this.router.navigate(['/dashboard']);
      } else {
        this.isAuthenticate = false;
        this.isAdmin = false;
        this.username = '';
      }
    });
  }

  onLogout() {
    this.authService.onLogout();
    this.router.navigate(['/']);
  }
}
