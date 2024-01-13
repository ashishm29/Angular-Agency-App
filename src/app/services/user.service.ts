import { Injectable } from '@angular/core';

import { FirestoreService } from './firestore.service';
import { User } from '../models/authentication';
import {
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
} from '@angular/fire/firestore';
import { AppConstant } from '../appConstant';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private firestoreService: FirestoreService) {}

  async getSalesmanList() {
    let responseCollection: User[] = [];
    const q = query(this.firestoreService.userCollectionInstance);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      responseCollection.push({
        ...doc.data(),
        id: doc.id,
      } as User);
    });
    return responseCollection;
  }

  addUser(details: User) {
    return addDoc(this.firestoreService.userCollectionInstance, details);
  }

  updateUser(details: User) {
    return updateDoc(
      doc(
        this.firestoreService.firestore,
        AppConstant.USER_COLLECTION_NAME,
        details.id
      ),
      {
        ...details,
      }
    );
  }

  deleteUser(docId: string) {
    const docRef = doc(
      this.firestoreService.firestore,
      AppConstant.USER_COLLECTION_NAME,
      docId
    );
    return deleteDoc(docRef);
  }
}
