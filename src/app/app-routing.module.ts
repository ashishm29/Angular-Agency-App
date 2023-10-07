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

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dataentry', component: DataEntryComponent },
  { path: 'recovery', component: RecoveryComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'logindetails', component: LoginDetailsComponent },
  { path: 'search', component: SearchByStoreComponent },
  {
    path: 'editinfo',
    component: EditInfoComponent,
    children: [
      { path: 'editroute', component: EditRouteDetailsComponent },
      { path: 'editstore', component: EditStoreDetailsComponent },
      { path: 'editbill', component: EditBillDetailsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
