import { Injectable, OnInit } from '@angular/core';
import {
  QueryConstraint,
  getDocs,
  query,
  where,
  collection,
  addDoc,
} from '@angular/fire/firestore';
import { User } from '../models/authentication';
import { FirestoreService } from './firestore.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  constructor(public firestoreService: FirestoreService) {}

  userSubject = new BehaviorSubject<User>(null!);
  _users: User[] = [];
  userDetails!: User;
  ngOnInit(): void {}

  // onSignUp(user: User) {
  //   // Add document
  //   const coll = collection(this.firestoreService.firestore, 'UserCollection');
  //   const document = addDoc(coll, user)
  //     .then(() => {
  //       console.log('Success');
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  async onLogin(details: User) {
    let responseCollection: User[] = [];
    const queryConditions: QueryConstraint[] = [];

    queryConditions.push(where('mobileNumber', '==', details.mobileNumber));
    queryConditions.push(where('password', '==', details.password));

    // Create a query against the collection.
    const q = query(
      this.firestoreService.userCollectionInstance,
      ...queryConditions
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      responseCollection.push({
        ...doc.data(),
        id: doc.id,
      } as User);
      this.userDetails = responseCollection[0];
      this.userSubject.next(responseCollection[0]);
      localStorage.setItem('userData', JSON.stringify(responseCollection[0]));
    });
    console.log(JSON.stringify(responseCollection));
    return responseCollection;
  }

  autoLogin() {
    const userData: {
      mobileNumber: string;
      password: string;
      id: string;
      role: string;
      username: string;
      salary: number;
    } = JSON.parse(localStorage.getItem('userData')!);

    if (!userData) {
      return;
    }

    if (userData) {
      this.userDetails = userData;
      this.userSubject.next(userData);
    }
  }

  isAdmin() {
    if (this.userDetails) {
      if (this.userDetails.role == 'admin') {
        return true;
      }
    }

    return false;
  }

  getuserDetails() {
    return this.userDetails;
  }

  onLogout() {
    this.userDetails = null!;
    localStorage.removeItem('userData');
    this.userSubject.next(null!);

    // if (this.tokenExpirationTimeout) {
    //   clearTimeout(this.tokenExpirationTimeout);
    // }
    // this.tokenExpirationTimeout = null;
  }

  // async onFetchLoginDetails() {
  //   // Read collection
  //   const collectionInstance = collection(
  //     this.firestoreService.firestore,
  //     'UserCollection'
  //   );
  //   const docsSnap = await getDocs(collectionInstance);
  //   docsSnap.forEach((doc) => {
  //     console.log(doc);
  //     console.log(doc.id);
  //     console.log(doc.data());
  //     this._users.push({
  //       ...doc.data(),
  //       id: doc.id,
  //     } as User);
  //   });

  //   console.log(JSON.stringify(this._users));

  //   return this._users;
  // }

  // onUpdateLoginDetails(user: User) {
  //   const db = getFirestore();

  //   updateDoc(doc(db, 'UserCollection', user.id), {
  //     ...user,
  //   })
  //     .then(() => {
  //       console.log('Updated Successfully');
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

  // onDelete(user: User) {
  //   const db = getFirestore();
  //   deleteDoc(doc(db, 'UserCollection', user.id))
  //     .then(() => {
  //       console.log('Deleted Successfully');
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

  // IfNotExistCreateNewCollections() {
  //   const coll = collection(
  //     this.firestoreService.firestore,
  //     'AshishCollection'
  //   );

  //   addDoc(this.firestoreService.ashishCollectionInstance24, {
  //     name: '123',
  //     Add: 'dharashiv',
  //   });
  // }
}
