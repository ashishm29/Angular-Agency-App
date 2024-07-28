import { StoreDetails } from '../models/route';

export interface IStore {
  storeCollection: StoreDetails[];
  onFetchStoreDetails(selecetdValue: string): any;
  onStoreSelected(selectedStore: StoreDetails): any;
  subscribeStoreNameValueChange(): any;
  _filter(name: string): StoreDetails[];
  displayFn(user: StoreDetails): string;
}
