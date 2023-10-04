import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { getDoc, getDocs } from '@firebase/firestore';
import { BillDetails, PaymentMode, RecoveryDetails } from '../models/route';
import {
  QueryConstraint,
  addDoc,
  doc,
  orderBy,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { AppConstant } from '../appConstant';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  constructor(public firestoreService: FirestoreService) {}

  async getFilteredBills(
    route: string,
    storeName: string,
    fromBillDate: string,
    toBillDate: string
  ) {
    let collectionData: BillDetails[] = [];

    const queryConditions: QueryConstraint[] = [];

    if (route) {
      queryConditions.push(where('route', '==', route));
    }

    if (storeName) {
      queryConditions.push(where('storeName.storeName', '==', storeName));
    }

    if (fromBillDate) {
      queryConditions.push(where('billDate', '>=', fromBillDate));

      if (toBillDate) {
        queryConditions.push(where('billDate', '<=', toBillDate));
      }
    }

    // Create a query against the collection.
    const q = query(
      this.firestoreService.billCollectionInstance,
      ...queryConditions
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      collectionData.push({
        ...doc.data(),
        id: doc.id,
      } as BillDetails);
    });
    console.log(JSON.stringify(collectionData));
    return collectionData;
  }
}
