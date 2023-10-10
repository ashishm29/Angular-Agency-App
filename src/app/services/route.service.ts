import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { AppConstant } from '../appConstant';
import { deleteDoc, doc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  constructor(private firestoreService: FirestoreService) {}

  deleteRoute(docId: string) {
    const docRef = doc(
      this.firestoreService.firestore,
      AppConstant.ROUTE_COLLECTION_NAME,
      docId
    );
    return deleteDoc(docRef);
  }
}
