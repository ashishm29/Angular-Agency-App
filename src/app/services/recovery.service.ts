import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { getDoc, getDocs } from '@firebase/firestore';
import { BillDetails, PaymentMode, RecoveryDetails } from '../models/route';
import {
  QueryConstraint,
  addDoc,
  deleteDoc,
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

  async getRecoveryDetails() {
    let collectionData: RecoveryDetails[] = [];

    const queryConditions: QueryConstraint[] = [];
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

  async getFilteredBills(storeName: string) {
    let collectionData: BillDetails[] = [];

    const queryConditions: QueryConstraint[] = [
      where('storeName.storeName', '==', storeName),
      where('pendingAmount', '>', 0),
      orderBy('pendingAmount', 'asc'),
    ];
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

  updateBillPendingAmount(details: BillDetails) {
    return updateDoc(
      doc(
        this.firestoreService.firestore,
        AppConstant.BILL_COLLECTION_NAME,
        details.id
      ),
      {
        ...details,
      }
    );
  }

  async getBillRecoveryDetails(billNumber: string) {
    let collectionData: RecoveryDetails[] = [];

    const queryConditions: QueryConstraint[] = [
      where('billNumber', '==', billNumber),
    ];

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
