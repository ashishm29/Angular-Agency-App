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

  storeCollectionInstance = collection(
    this.firestore,
    AppConstant.STORE_COLLECTION_NAME
  );

  routeCollectionInstance = collection(
    this.firestore,
    AppConstant.ROUTE_COLLECTION_NAME
  );

  loggingCollectionInstance = collection(
    this.firestore,
    AppConstant.LOGGING_COLLECTION_NAME
  );

  expenseCollectionInstance = collection(
    this.firestore,
    AppConstant.EXPENSE_COLLECTION_NAME
  );

  attendacneCollectionInstance = collection(
    this.firestore,
    AppConstant.ATTENDANCE_COLLECTION_NAME
  );

  recoveryHistoryCollectionInstance = collection(
    this.firestore,
    AppConstant.RECOVERY_HISTORY_COLLECTION_NAME
  );

  orderCollectionInstance = collection(
    this.firestore,
    AppConstant.ORDER_COLLECTION_NAME
  );

  productCollectionInstance = collection(
    this.firestore,
    AppConstant.PRODUCT_COLLECTION_NAME
  );

  companyCollectionInstance = collection(
    this.firestore,
    AppConstant.COMPANY_COLLECTION_NAME
  );

  // ashishCollectionInstance24 = collection(
  //   this.firestore,
  //   'AshishCollection_24'
  // );

  constructor(
    public firestore: Firestore,
    public fireStoreInstance: FirestoreInstances
  ) {}
}
