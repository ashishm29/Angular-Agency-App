import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { getDocs } from '@firebase/firestore';
import { PaymentMode, RecoveryDetails } from '../models/route';
import {
  QueryConstraint,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
} from '@angular/fire/firestore';
import { AppConstant } from '../appConstant';

@Injectable({
  providedIn: 'root',
})
export class RecoveryService {
  constructor(public firestoreService: FirestoreService) {}

  async getPaymentModes() {
    let resultData: PaymentMode[] = [];
    const docsSnap = await getDocs(
      this.firestoreService.paymentModeCollectionInstance
    );
    docsSnap.forEach((doc) => {
      console.log(doc.data());
      resultData.push({
        ...doc.data(),
        id: doc.id,
      } as PaymentMode);
    });
    console.log(JSON.stringify(resultData));
    return resultData;
  }

  addRecoveryDetails(details: RecoveryDetails) {
    return addDoc(this.firestoreService.recoveryCollectionInstance, details);
  }

  async getRecoveryDetails(billNumber: string = '') {
    let collectionData: RecoveryDetails[] = [];
    const queryConditions: QueryConstraint[] = [];

    if (billNumber) {
      queryConditions.push(where('billNumber', '==', billNumber));
    }

    // Create a query against the collection.
    const q = query(
      this.firestoreService.recoveryCollectionInstance,
      ...queryConditions
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      collectionData.push({
        ...doc.data(),
        id: doc.id,
      } as RecoveryDetails);
    });
    console.log(JSON.stringify(collectionData));
    return collectionData;
  }

  deleteRecovery(docId: string) {
    const docRef = doc(
      this.firestoreService.firestore,
      AppConstant.RECOVERY_COLLECTION_NAME,
      docId
    );
    return deleteDoc(docRef);
  }
}
