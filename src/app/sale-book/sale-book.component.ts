import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  NgForm,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { AppConstant } from '../appConstant';
import { BillService } from '../services/bill.service';
import { LocalStorageService } from '../services/local-storage.service';
import { StoreRouteService } from '../interface/StoreRouteService';
import { MY_SERVICE_TOKEN } from '../app.module';

@Component({
  selector: 'app-sale-book',
  templateUrl: './sale-book.component.html',
  styleUrls: ['./sale-book.component.scss'],
})
export class SaleBookComponent implements OnInit {
  @ViewChild('billFormDirective') private billFormDirective!: NgForm;
  routeName!: string;
  myControl = new UntypedFormControl();
  isClicked: boolean = false;
  buttonText: string = AppConstant.ADD_BILL_BTN_TEXT;
  localRouteValue!: string;

  constructor(
    public billService: BillService,
    private localStorageService: LocalStorageService,
    @Inject(MY_SERVICE_TOKEN) public storeRouteService: StoreRouteService
  ) {}

  ngOnInit(): void {
    this.initialize();
    this.storeRouteService.onFetchRoute();

    if (this.localRouteValue) {
      this.storeRouteService.onRouteSelectionChange(this.localRouteValue);
    }
  }

  initialize() {
    this.localRouteValue = this.localStorageService.getKeyValue(
      AppConstant.ROUTE_LOCAL_STORAGE_KEY
    ) as string;

    this.storeRouteService.billFormGroup = new UntypedFormGroup({
      route: new UntypedFormControl(this.localRouteValue, [
        Validators.required,
      ]),
      storeName: new UntypedFormControl('', [Validators.required]),
      billNumber: new UntypedFormControl('', [Validators.required]),
      billDate: new UntypedFormControl('', [Validators.required]),
      billAmount: new UntypedFormControl('', [Validators.required]),
      address: new UntypedFormControl(),
      comment: new UntypedFormControl(),
    });

    if (this.billFormDirective) {
      this.billFormDirective.resetForm();
    }

    this.storeRouteService.subscribeStoreNameValueChange();
  }
}
