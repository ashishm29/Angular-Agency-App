import { Injectable, OnInit } from '@angular/core';
import {
  Firestore,
  FirestoreInstances,
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import {
  BillDetails,
  Route,
  StoreDetails as StoreDetails,
} from '../models/route';
import { AppConstant } from '../appConstant';

@Injectable({
  providedIn: 'root',
})
export class DataEntryService implements OnInit {
  ngOnInit(): void {}

  constructor(
    public firestore: Firestore,
    public fireStoreInstance: FirestoreInstances
  ) {}

  addRoute(route: Route) {
    // Add Route
    const coll = collection(this.firestore, AppConstant.ROUTE_COLLECTION_NAME);
    return addDoc(coll, route);
  }

  addStoreDetails(store: StoreDetails) {
    // Add STORE
    const coll = collection(this.firestore, AppConstant.STORE_COLLECTION_NAME);
    return addDoc(coll, store);
  }

  addBillDetails(bill: BillDetails) {
    // Add BILL
    const coll = collection(this.firestore, AppConstant.BILL_COLLECTION_NAME);
    return addDoc(coll, bill);
  }

  async getRoutes() {
    const collectionInstance = collection(
      this.firestore,
      AppConstant.ROUTE_COLLECTION_NAME
    );
    let routes: Route[] = [];
    const docsSnap = await getDocs(collectionInstance);
    docsSnap.forEach((doc) => {
      console.log(doc.data());
      routes.push({
        ...doc.data(),
        id: doc.id,
      } as Route);
    });
    console.log(JSON.stringify(routes));
    return routes;
  }

  async getStores(route: string) {
    const collectionInstance = collection(
      this.firestore,
      AppConstant.STORE_COLLECTION_NAME
    );

    let storeCollection: StoreDetails[] = [];

    // Create a query against the collection.
    const q = query(collectionInstance, where('route', '==', route));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      storeCollection.push({
        ...doc.data(),
        id: doc.id,
      } as StoreDetails);
    });
    console.log(JSON.stringify(storeCollection));
    return storeCollection;
  }
}
