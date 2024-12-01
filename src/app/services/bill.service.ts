import { EventEmitter, Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { getDocs } from '@firebase/firestore';
import { BillDetails } from '../models/route';
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
import { LoggingService } from './logging.service';

@Injectable({
  providedIn: 'root',
})
export class BillService {
  parameters = new EventEmitter<any>();
  billUpdated = new EventEmitter();

  constructor(
    public firestoreService: FirestoreService,
    public logService: LoggingService
  ) {}

  async getFilteredBills(
    route: string,
    storeName: string,
    fromBillDate: string,
    toBillDate: string,
    billNumber: string,
    paidUnpaidSelection: any = ''
  ) {
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

    if (billNumber) {
      queryConditions.push(where('billNumber', '==', billNumber));
    }

    return this.getBills(queryConditions);
  }

  deleteBill(docId: string) {
    const docRef = doc(
      this.firestoreService.firestore,
      AppConstant.BILL_COLLECTION_NAME,
      docId
    );
    return deleteDoc(docRef);
  }

  async getFilteredBillsByStoreName(storeName: string, route: string) {
    const queryConditions: QueryConstraint[] = [
      where('route', '==', route),
      where('storeName.storeName', '==', storeName),
      where('pendingAmount', '>', 0),
      orderBy('pendingAmount', 'asc'),
    ];

    return this.getBills(queryConditions);
  }

  async getBillByDate(date: Date) {
    const queryConditions: QueryConstraint[] = [where('billDate', '==', date)];
    return this.getBills(queryConditions);
  }

  async getBillByStatus(status: string) {
    const queryConditions: QueryConstraint[] = [where('status', '==', status)];
    return this.getBills(queryConditions);
  }

  async getFilteredBillsByBillNumber(billnumber: string) {
    const queryConditions: QueryConstraint[] = [
      where('billNumber', '==', billnumber),
    ];

    return this.getBills(queryConditions);
  }

  private async getBills(queryConditions: QueryConstraint[]) {
    let collectionData: BillDetails[] = [];
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
    return collectionData;
  }

  updateBillPendingAmount(details: BillDetails) {
    this.logService.info('Update Bill Pending Amount', details);
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

  addBillDetails(bill: BillDetails) {
    return addDoc(this.firestoreService.billCollectionInstance, bill);
  }

  updateBillDetails(details: BillDetails) {
    this.logService.info('Update Bill Details', details);
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
}
