import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { DataEntryComponent } from './data-entry/data-entry.component';
import { RecoveryComponent } from './recovery/recovery.component';

const routes: Routes = [
  {path : '' , component : LoginComponent},
  {path : 'dashboard' , component : DashboardComponent},
  {path : 'dataentry' , component : DataEntryComponent},
  {path : 'recovery' , component : RecoveryComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
