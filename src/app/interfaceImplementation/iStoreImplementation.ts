import { map, Observable, startWith } from 'rxjs';
import { AppConstant } from '../appConstant';
import { IStore } from '../interface/iStore';
import { StoreDetails } from '../models/route';
import { StoreService } from '../services/store.service';
import { UntypedFormGroup } from '@angular/forms';

export class IStoreImplementation implements IStore {
  storeCollection: StoreDetails[] = [];
  filteredOptions: Observable<StoreDetails[]> | undefined;
  selectedStore!: StoreDetails | null;
  //collection: itemDetail[] = [];

  // headerFormGroup!: UntypedFormGroup;

  constructor(
    private storeService: StoreService,
    private headerFormGroup: UntypedFormGroup
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
    this.headerFormGroup.patchValue({
      mobileNumber: selectedStore.mobileNo,
      address: selectedStore.address,
    });

    //this.collection = [];
    //this.updateGrid();
  }

  subscribeStoreNameValueChange() {
    let routeControl = this.headerFormGroup.controls['storeName'];
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
}
