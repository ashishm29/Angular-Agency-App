import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { AppConstant } from '../appConstant';
import { deleteDoc, doc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor(private firestoreService: FirestoreService) {}

  deleteStore(docId: string) {
    const docRef = doc(
      this.firestoreService.firestore,
      AppConstant.STORE_COLLECTION_NAME,
      docId
    );
    return deleteDoc(docRef);
  }
}
