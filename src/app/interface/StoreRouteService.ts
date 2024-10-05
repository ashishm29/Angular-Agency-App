import { UntypedFormGroup } from '@angular/forms';
import { Route, StoreDetails } from '../models/route';
import { Observable } from 'rxjs';

export interface StoreRouteService {
  storeCollection: StoreDetails[];
  billFormGroup: UntypedFormGroup;
  filteredOptions: Observable<StoreDetails[]> | undefined;
  selectedStore: StoreDetails | null;
  routeCollection: Route[];

  onFetchStoreDetails(selecetdValue: string): any;
  onStoreSelected(selectedStore: StoreDetails): any;
  subscribeStoreNameValueChange(): any;
  _filter(name: string): StoreDetails[];
  displayFn(user: StoreDetails): string;

  onFetchRoute(): Route[];
  onRouteSelectionChange(value: string): void;
}
