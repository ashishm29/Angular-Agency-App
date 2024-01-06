import { Injectable } from '@angular/core';

import { FirestoreService } from './firestore.service';
import { User } from '../models/authentication';
import { addDoc, getDocs, query } from '@angular/fire/firestore';

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
}
