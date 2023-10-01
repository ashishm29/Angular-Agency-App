import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  DocumentReference,
  Firestore,
  FirestoreInstances,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { firebaseAppFactory } from '@angular/fire/app/app.module';
import { FirebaseApp, initializeApp } from '@angular/fire/app';
import { User } from '../models/authentication';
import { map, tap } from 'rxjs/operators';
import { Console } from 'console';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  constructor(
    public firestore: Firestore,
    public fireStoreInstance: FirestoreInstances
  ) {}

  _users: User[] = [];
  //firestoreInstance : Firestore = inject(Firestore);
  ngOnInit(): void {}

  onSignUp(user: User) {
    // Add document
    const coll = collection(this.firestore, 'UserCollection');
    const document = addDoc(coll, user)
      .then(() => {
        console.log('Success');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async onLogin() {
    const db = getFirestore();

    const userCollection = collection(this.firestore, 'UserCollection');
    const userCollection1 = collection(
      this.firestore,
      'UserCollection/User/UserCollection'
    );
    let userDocReference = doc(db, 'UserCollection', 'Users');

    collectionData(userCollection).forEach((row) => {
      console.log(row);
    });

    //// Update Document
    // const setdocument = updateDoc(doc(db, 'UserCollection', 'Users'), {
    //   UserCollection: [
    //     {
    //       mobileNumber: 9404036779,
    //       password: 'admin',
    //       Roles: [
    //         {
    //           RoleId: 100,
    //           RoleName: 'admin',
    //         },
    //       ],
    //     },
    //     {
    //       mobileNumber: 9665154120,
    //       password: 'admin',
    //       Roles: [
    //         {
    //           RoleId: 101,
    //           RoleName: 'sales',
    //         },
    //       ],
    //     },
    //   ],
    // })
    //   .then(() => {
    //     console.log('Success');
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    // let _user;
  }

  async onFetchLoginDetails() {
    // Read collection
    const collectionInstance = collection(this.firestore, 'UserCollection');
    const docsSnap = await getDocs(collectionInstance);
    docsSnap.forEach((doc) => {
      console.log(doc);
      console.log(doc.id);
      console.log(doc.data());
      this._users.push({
        ...doc.data(),
        id: doc.id,
      } as User);
    });

    console.log(JSON.stringify(this._users));

    return this._users;
  }

  onUpdateLoginDetails(user: User) {
    const db = getFirestore();

    updateDoc(doc(db, 'UserCollection', user.id), {
      ...user,
    })
      .then(() => {
        console.log('Updated Successfully');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  onDelete(user: User) {
    const db = getFirestore();
    deleteDoc(doc(db, 'UserCollection', user.id))
      .then(() => {
        console.log('Deleted Successfully');
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
