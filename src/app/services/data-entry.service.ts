import { Injectable, OnInit } from '@angular/core';
import {
  Firestore,
  FirestoreInstances,
  QueryConstraint,
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
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
    //const coll = collection(this.firestore, AppConstant.ROUTE_COLLECTION_NAME);

    // let dt = new Date();
    // dt.toISOString();
    return setDoc(
      doc(
        this.firestore,
        AppConstant.ROUTE_COLLECTION_NAME,
        route.routeName.toLowerCase()
      ),
      route
    );
    //return addDoc(coll, route);
  }

  updateRoute(details: Route) {
    return updateDoc(
      doc(this.firestore, AppConstant.ROUTE_COLLECTION_NAME, details.id),
      {
        ...details,
      }
    );
  }

  addStoreDetails(store: StoreDetails) {
    // Add STORE
    const coll = collection(this.firestore, AppConstant.STORE_COLLECTION_NAME);
    return addDoc(coll, store);
  }

  updateStoreDetails(details: StoreDetails) {
    return updateDoc(
      doc(this.firestore, AppConstant.STORE_COLLECTION_NAME, details.id),
      {
        ...details,
      }
    );
  }

  addBillDetails(bill: BillDetails) {
    // Add BILL
    const coll = collection(this.firestore, AppConstant.BILL_COLLECTION_NAME);
    return addDoc(coll, bill);
  }

  updateBillDetails(details: BillDetails) {
    return updateDoc(
      doc(this.firestore, AppConstant.BILL_COLLECTION_NAME, details.id),
      {
        ...details,
      }
    );
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

    const queryConditions: QueryConstraint[] = [];

    if (route) {
      queryConditions.push(where('route', '==', route));
    }

    let storeCollection: StoreDetails[] = [];

    // Create a query against the collection.
    const q = query(collectionInstance, ...queryConditions);
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
