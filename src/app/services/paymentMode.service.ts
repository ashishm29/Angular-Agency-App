import { Injectable } from '@angular/core';

import { FirestoreService } from './firestore.service';
import { getDocs, query } from '@angular/fire/firestore';
import { PaymentMode } from '../models/route';

@Injectable({
  providedIn: 'root',
})
export class PaymentModeService {
  constructor(private firestoreService: FirestoreService) {}

  async getPaymentModeList() {
    let responseCollection: PaymentMode[] = [];
    const q = query(this.firestoreService.paymentModeCollectionInstance);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      responseCollection.push({
        ...doc.data(),
        id: doc.id,
      } as PaymentMode);
    });
    return responseCollection;
  }
}
