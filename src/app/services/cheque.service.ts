import { Injectable } from '@angular/core';
import { BaseService } from '../abstract/baseService';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class ChequeService extends BaseService {
  constructor(public firestoreService: FirestoreService) {
    super();
    this.collectionName = this.firestoreService.chequeCollectionInstance;
  }
}
