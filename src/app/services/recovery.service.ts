import { EventEmitter, Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { getDocs } from '@firebase/firestore';
import { PaymentMode, RecoveryDetails, RecoveryHistory } from '../models/route';
import {
  QueryConstraint,
  addDoc,
  deleteDoc,
  doc,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { AppConstant } from '../appConstant';
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root',
})
export class RecoveryService {
  constructor(
    public firestoreService: FirestoreService,
    public logService: LoggingService
  ) {}

  parameters = new EventEmitter<any>();

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

  async getRecoveryDetails(
    billNumber: string = '',
    fromDate: string = '',
    toDate: string = ''
  ) {
    let collectionData: RecoveryDetails[] = [];
    const queryConditions: QueryConstraint[] = [];

    if (billNumber) {
      queryConditions.push(where('billNumber', '==', billNumber));
    }

    if (fromDate) {
      queryConditions.push(where('recoveryDate', '>=', fromDate));

      if (toDate) {
        queryConditions.push(where('recoveryDate', '<=', toDate));
      } else {
        queryConditions.push(where('recoveryDate', '<=', fromDate));
      }
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
    this.logService.info('Delete Recovery', docId);
    const docRef = doc(
      this.firestoreService.firestore,
      AppConstant.RECOVERY_COLLECTION_NAME,
      docId
    );
    return deleteDoc(docRef);
  }

  updateRecovery(details: RecoveryDetails) {
    this.logService.info('Update Recovery Details', details);
    return updateDoc(
      doc(
        this.firestoreService.firestore,
        AppConstant.RECOVERY_COLLECTION_NAME,
        details.id
      ),
      {
        ...details,
      }
    );
  }

  addRecoveryFromSalesman(details: RecoveryHistory) {
    return addDoc(
      this.firestoreService.recoveryHistoryCollectionInstance,
      details
    );
  }

  async getRecoveryFromSalesman() {
    let resultData: RecoveryHistory[] = [];
    const docsSnap = await getDocs(
      this.firestoreService.recoveryHistoryCollectionInstance
    );
    docsSnap.forEach((doc) => {
      console.log(doc.data());
      resultData.push({
        ...doc.data(),
        id: doc.id,
      } as RecoveryHistory);
    });
    return resultData;
  }
  updateRecoveryFromSalesman(details: RecoveryHistory) {
    return updateDoc(
      doc(
        this.firestoreService.firestore,
        AppConstant.RECOVERY_HISTORY_COLLECTION_NAME,
        details.id
      ),
      {
        ...details,
      }
    );
  }

  deleteRecoveryFromSalesman(docId: string) {
    const docRef = doc(
      this.firestoreService.firestore,
      AppConstant.RECOVERY_HISTORY_COLLECTION_NAME,
      docId
    );
    return deleteDoc(docRef);
  }
}
