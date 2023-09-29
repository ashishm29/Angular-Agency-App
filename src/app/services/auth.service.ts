import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentReference,
  Firestore,
  addDoc, collection,
  collectionData,
  doc, getDoc, getFirestore }
from '@angular/fire/firestore';
import { firebaseAppFactory } from '@angular/fire/app/app.module';
import { initializeApp } from '@angular/fire/app';
import { User } from '../models/authentication';
import { map } from 'rxjs/operators';
import { Console } from 'console';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnInit {
  constructor(public firestore : Firestore) {}

  //firestore : Firestore = inject(Firestore);
  ngOnInit(): void {}

  async onLogin() {

    // const coll = collection(this.firestore,'UserCollection');
    // const document = addDoc(coll,{
    //   'mobileNumber' : 9404036779,
    //   'password' : 'admin'
    // }).then(()=>
    // {
    //   console.log("Success")
    // }).catch((err)=>
    // {
    //   console.log(err);
    // });

     const db = getFirestore();
  //   //const docRef = doc(db, "Users", 'User');
  //   const docRef = doc(db, "UserCollection", 'UserDoc');
  //   try {
  //     const docSnap = await getDoc(docRef);
  //     console.log('Data : ' + JSON.stringify(docSnap.data()));
  // } catch(error) {
  //     console.log(error)
  // }

  //let _user = new User();
    //this.db.collection('').getDoc('').get
    try {
      const collectionInstance = collection(this.firestore,'UserCollection');
      collectionData(collectionInstance).pipe( map(val=>{
        console.log(val);
        // let parseddata = JSON.parse(JSON.stringify(val))
        // console.log(parseddata);
      })).subscribe();
  } catch(error) {
      console.log(error)
  }

  }
}




