import { Injectable } from '@angular/core';
import {
  Firestore,
  FirestoreInstances,
  collection,
} from '@angular/fire/firestore';
import { AppConstant } from '../appConstant';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  paymentModeCollectionInstance = collection(
    this.firestore,
    AppConstant.PAYMENT_MODE_COLLECTION_NAME
  );

  recoveryCollectionInstance = collection(
    this.firestore,
    AppConstant.RECOVERY_COLLECTION_NAME
  );

  billCollectionInstance = collection(
    this.firestore,
    AppConstant.BILL_COLLECTION_NAME
  );

  userCollectionInstance = collection(
    this.firestore,
    AppConstant.USER_COLLECTION_NAME
  );

  constructor(
    public firestore: Firestore,
    public fireStoreInstance: FirestoreInstances
  ) {}
}
