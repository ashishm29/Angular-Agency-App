import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { addDoc } from '@angular/fire/firestore';
import { Expense } from '../models/route';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  constructor(public firestoreService: FirestoreService) {}

  add(details: Expense) {
    return addDoc(this.firestoreService.expenseCollectionInstance, details);
  }
}
