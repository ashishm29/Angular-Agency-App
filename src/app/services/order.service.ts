import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { addDoc } from '@angular/fire/firestore';
import { Order } from '../models/route';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(public firestoreService: FirestoreService) {}

  add(details: Order) {
    return addDoc(this.firestoreService.orderCollectionInstance, details);
  }

  // async get() {
  //   let collectionData: Attendance[] = [];
  //   // Create a query against the collection.
  //   const q = query(this.firestoreService.attendacneCollectionInstance);
  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((doc) => {
  //     console.log(doc.data());
  //     collectionData.push({
  //       ...doc.data(),
  //       id: doc.id,
  //     } as Attendance);
  //   });
  //   return collectionData;
  // }

  // addExpense(details: Expense) {
  //   return addDoc(this.firestoreService.expenseCollectionInstance, details);
  // }

  // deleteExpense(docId: string) {
  //   const docRef = doc(
  //     this.firestoreService.firestore,
  //     AppConstant.EXPENSE_COLLECTION_NAME,
  //     docId
  //   );
  //   return deleteDoc(docRef);
  // }

  // updateExpense(details: Expense) {
  //   return updateDoc(
  //     doc(
  //       this.firestoreService.firestore,
  //       AppConstant.EXPENSE_COLLECTION_NAME,
  //       details.id
  //     ),
  //     {
  //       ...details,
  //     }
  //   );
  // }

  // async getExpense() {
  //   let collectionData: Expense[] = [];
  //   // Create a query against the collection.
  //   const q = query(this.firestoreService.expenseCollectionInstance);
  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((doc) => {
  //     console.log(doc.data());
  //     collectionData.push({
  //       ...doc.data(),
  //       id: doc.id,
  //     } as Expense);
  //   });
  //   return collectionData;
  // }
}
