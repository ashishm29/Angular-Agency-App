import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { AppConstant } from '../appConstant';
import {
  QueryConstraint,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { StoreDetails } from '../models/route';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor(private firestoreService: FirestoreService) {}

  async getStores(route: any) {
    const queryConditions: QueryConstraint[] = [];
    if (route === 'GRAMIN') {
      route = [
        'YEDSHI TO DHOKI',
        'BEMBALI',
        'UPLA TO TER',
        '12 WADI SAROLA CHIKALI',
        'TULJAPUR',
        'TEST ROUTE',
      ];
    }

    if (route) {
      if (Array.isArray(route)) {
        queryConditions.push(where('route', 'in', route));
      } else {
        queryConditions.push(where('route', '==', route));
      }
    }

    return this.getStoreFilterdData(queryConditions);
  }

  addStoreDetails(store: StoreDetails) {
    return addDoc(this.firestoreService.storeCollectionInstance, store);
  }

  async getSpecificStoreDetails(store: StoreDetails) {
    const queryConditions: QueryConstraint[] = [];

    queryConditions.push(where('mobileNo', '==', store.mobileNo));
    return this.getStoreFilterdData(queryConditions);
  }

  updateStoreDetails(details: StoreDetails) {
    return updateDoc(
      doc(
        this.firestoreService.firestore,
        AppConstant.STORE_COLLECTION_NAME,
        details.id
      ),
      {
        ...details,
      }
    );
  }

  deleteStore(docId: string) {
    const docRef = doc(
      this.firestoreService.firestore,
      AppConstant.STORE_COLLECTION_NAME,
      docId
    );
    return deleteDoc(docRef);
  }

  async getStoreFilterdData(queryConditions: QueryConstraint[]) {
    let storeCollection: StoreDetails[] = [];

    // Create a query against the collection.
    const q = query(
      this.firestoreService.storeCollectionInstance,
      ...queryConditions
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      storeCollection.push({
        ...doc.data(),
        id: doc.id,
      } as StoreDetails);
    });
    return storeCollection;
  }
}
