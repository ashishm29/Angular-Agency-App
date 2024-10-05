import { map, Observable, startWith } from 'rxjs';
import { AppConstant } from '../appConstant';
import { StoreRouteService } from '../interface/StoreRouteService';
import { Route, StoreDetails } from '../models/route';
import { StoreService } from '../services/store.service';
import { UntypedFormGroup } from '@angular/forms';
import { RouteService } from '../services/route.service';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class StoreRouteServiceImpl implements StoreRouteService {
  storeCollection: StoreDetails[] = [];
  filteredOptions: Observable<StoreDetails[]> | undefined;
  selectedStore!: StoreDetails | null;
  routeCollection: Route[] = [];
  billFormGroup!: UntypedFormGroup;

  constructor(
    private storeService: StoreService,
    private routeService: RouteService,
    private localStorageService: LocalStorageService
  ) {}

  onFetchStoreDetails(selecetdValue: string) {
    this.storeCollection = [];
    this.storeService.getStores(selecetdValue).then((result) => {
      if (result && result.length > 0) {
        this.storeCollection = result;
      } else {
        console.log(AppConstant.STORE_NOT_FOUND_MSG);
      }
      this.subscribeStoreNameValueChange();
    });
  }

  onStoreSelected(selectedStore: StoreDetails) {
    this.selectedStore = selectedStore;
    this.billFormGroup.patchValue({
      mobileNumber: selectedStore.mobileNo,
      address: selectedStore.address,
    });
  }

  subscribeStoreNameValueChange() {
    let routeControl = this.billFormGroup.controls['storeName'];
    this.filteredOptions = routeControl?.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name
          ? this._filter(name as string)
          : this.storeCollection.slice();
      })
    );
  }

  _filter(name: string): StoreDetails[] {
    const filterValue = name.toLowerCase();

    return this.storeCollection.filter((option) =>
      option.storeName.toLowerCase().includes(filterValue)
    );
  }

  displayFn(user: StoreDetails): string {
    return user && user.storeName ? user.storeName : '';
  }

  // =============================ROUTE==========================

  onFetchRoute() {
    this.routeCollection = [];
    this.routeService.getRoutes().then((result) => {
      if (result && result.length > 0) {
        this.routeCollection = result;
      } else {
        console.log(AppConstant.ROUTE_NOT_FOUND_MSG);
      }
    });

    return this.routeCollection;
  }

  onRouteSelectionChange(selecetdValue: string) {
    console.log(selecetdValue);
    this.localStorageService.setKeyValue(
      AppConstant.ROUTE_LOCAL_STORAGE_KEY,
      selecetdValue
    );
    if (selecetdValue) {
      this.billFormGroup.get('storeName')?.reset();
      this.billFormGroup.get('billNumber')?.reset();
      this.billFormGroup.get('billDate')?.reset();
      this.billFormGroup.get('billAmount')?.reset();
      this.billFormGroup.get('comment')?.reset();
      this.onFetchStoreDetails(selecetdValue);
    }
  }
}
