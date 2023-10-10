import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { DataEntryComponent } from './data-entry/data-entry.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { HistoryComponent } from './history/history.component';
import { LoginDetailsComponent } from './login-details/login-details.component';
import { SearchByStoreComponent } from './search/search-by-store/search-by-store.component';
import { EditInfoComponent } from './edit-info/edit-info.component';
import { EditRouteDetailsComponent } from './edit-info/edit-route-details/edit-route-details.component';
import { EditStoreDetailsComponent } from './edit-info/edit-store-details/edit-store-details.component';
import { EditBillDetailsComponent } from './edit-info/edit-bill-details/edit-bill-details.component';
import { AuthGuard } from './services/auth-guard.service';
import { DeleteInfoComponent } from './delete-info/delete-info.component';
import { DeleteRouteComponent } from './delete-info/delete-route/delete-route.component';
import { DeleteStoreComponent } from './delete-info/delete-store/delete-store.component';
import { DeleteRecoveryComponent } from './delete-info/delete-recovery/delete-recovery.component';

const routes: Routes = [
  { path: '', component: LoginComponent, pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'dataentry',
    component: DataEntryComponent,
    canActivate: [AuthGuard],
  },
  { path: 'recovery', component: RecoveryComponent, canActivate: [AuthGuard] },
  { path: 'history', component: HistoryComponent, canActivate: [AuthGuard] },
  {
    path: 'logindetails',
    component: LoginDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'search',
    component: SearchByStoreComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'editinfo',
    component: EditInfoComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'editroute',
        component: EditRouteDetailsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'editstore',
        component: EditStoreDetailsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'editbill',
        component: EditBillDetailsComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'delete',
    component: DeleteInfoComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'route',
        component: DeleteRouteComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'store',
        component: DeleteStoreComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'recovery',
        component: DeleteRecoveryComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
