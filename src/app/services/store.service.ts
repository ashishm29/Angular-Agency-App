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

  async getStores(route: string) {
    const queryConditions: QueryConstraint[] = [];

    if (route) {
      queryConditions.push(where('route', '==', route));
    }

    let storeCollection: StoreDetails[] = [];

    // Create a query against the collection.
    const q = query(
      this.firestoreService.storeCollectionInstance,
      ...queryConditions
    );
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

  addStoreDetails(store: StoreDetails) {
    return addDoc(this.firestoreService.storeCollectionInstance, store);
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
}
