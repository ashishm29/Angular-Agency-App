import { InjectionToken, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppNavigationComponent } from './app-navigation/app-navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { LoginComponent } from './login/login.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DataEntryComponent } from './data-entry/data-entry.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { HistoryComponent } from './history/history.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { LoginDetailsComponent } from './login-details/login-details.component';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';

import {
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SearchComponent } from './search/search.component';
import { SearchByStoreComponent } from './search/search-by-store/search-by-store.component';
import { MatSortModule } from '@angular/material/sort';
import { RecoveryInfoComponent } from './search/recovery-info/recovery-info.component';
import { MatDialogModule } from '@angular/material/dialog';
import { EditInfoComponent } from './edit-info/edit-info.component';
import { EditRouteDetailsComponent } from './edit-info/edit-route-details/edit-route-details.component';
import { EditStoreDetailsComponent } from './edit-info/edit-store-details/edit-store-details.component';
import { EditBillDetailsComponent } from './edit-info/edit-bill-details/edit-bill-details.component';
import { DeleteConfirmationDialogComponent } from './dialog/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { DeleteInfoComponent } from './delete-info/delete-info.component';
import { DeleteStoreComponent } from './delete-info/delete-store/delete-store.component';
import { DeleteRouteComponent } from './delete-info/delete-route/delete-route.component';
import { DeleteRecoveryComponent } from './delete-info/delete-recovery/delete-recovery.component';
import { ValidationDialogComponent } from './dialog/validation-dialog/validation-dialog.component';
import { UpperCaseInputDirective } from './shared/UpperCaseInputDirective';
import { BillDataEntryComponent } from './data-entry/bill-data-entry/bill-data-entry.component';
import { StoreDataEntryComponent } from './data-entry/store-data-entry/store-data-entry.component';
import { RouteDataEntryComponent } from './data-entry/route-data-entry/route-data-entry.component';
import { AgGridModule } from 'ag-grid-angular';
import { ButtonRendererComponent } from './renderer/button-renderer/button-renderer.component';
import { EditRecoveryDetailsComponent } from './edit-info/edit-recovery-details/edit-recovery-details.component';
import { ExpenseManagerComponent } from './expense-manager/expense-manager.component';
import { SalesmanAttendanceComponent } from './expense-manager/salesman-attendance/salesman-attendance.component';
import { DatePickerRendererComponent } from './renderer/date-picker-renderer/date-picker-renderer.component';
import { ExpenseComponent } from './expense-manager/expense/expense.component';
import { RecoveryFromSalesmanComponent } from './dashboard/recovery-from-salesman/recovery-from-salesman.component';
import { SalesmanDataEntryComponent } from './data-entry/salesman-data-entry/salesman-data-entry.component';
import { OrdersComponent } from './orders/orders.component';
import { ProductDataEntryComponent } from './data-entry/product-data-entry/product-data-entry.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { DropdownRendererComponent } from './renderer/dropdown-renderer/dropdown-renderer.component';
import { SaleBookComponent } from './sale-book/sale-book.component';
import { StoreRouteService } from './interface/StoreRouteService';
import { StoreRouteServiceImpl } from './interfaceImplementation/StoreRouteServiceImpl';

const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'DD/MM/YYYY', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export const MY_SERVICE_TOKEN = new InjectionToken<StoreRouteService>('IStore');

@NgModule({
  declarations: [
    AppComponent,
    AppNavigationComponent,
    DashboardComponent,
    LoginComponent,
    DataEntryComponent,
    RecoveryComponent,
    HistoryComponent,
    LoginDetailsComponent,
    SearchComponent,
    SearchByStoreComponent,
    RecoveryInfoComponent,
    EditInfoComponent,
    EditRouteDetailsComponent,
    EditStoreDetailsComponent,
    EditBillDetailsComponent,
    DeleteConfirmationDialogComponent,
    DeleteInfoComponent,
    DeleteStoreComponent,
    DeleteRouteComponent,
    DeleteRecoveryComponent,
    ValidationDialogComponent,
    UpperCaseInputDirective,
    BillDataEntryComponent,
    StoreDataEntryComponent,
    RouteDataEntryComponent,
    ButtonRendererComponent,
    EditRecoveryDetailsComponent,
    ExpenseManagerComponent,
    SalesmanAttendanceComponent,
    DatePickerRendererComponent,
    ExpenseComponent,
    RecoveryFromSalesmanComponent,
    SalesmanDataEntryComponent,
    OrdersComponent,
    ProductDataEntryComponent,
    PurchaseComponent,
    DropdownRendererComponent,
    SaleBookComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatDividerModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatSortModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    AgGridModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
  ],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
    { provide: MY_SERVICE_TOKEN, useClass: StoreRouteServiceImpl },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
