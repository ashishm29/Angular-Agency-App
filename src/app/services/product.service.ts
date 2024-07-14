import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { CompanyDetail, ProductDetail } from '../models/route';
import {
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  QueryConstraint,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { AppConstant } from '../appConstant';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(public firestoreService: FirestoreService) {}

  add(details: ProductDetail) {
    var data = {
      ...details,
    };

    return addDoc(this.firestoreService.productCollectionInstance, data);
  }

  async getCompany() {
    let companys: CompanyDetail[] = [];
    const docsSnap = await getDocs(
      this.firestoreService.companyCollectionInstance
    );
    docsSnap.forEach((doc) => {
      console.log(doc.data());
      companys.push({
        ...doc.data(),
        id: doc.id,
      } as CompanyDetail);
    });
    return companys;
  }

  async getProducts() {
    let companys: ProductDetail[] = [];
    const docsSnap = await getDocs(
      this.firestoreService.productCollectionInstance
    );
    docsSnap.forEach((doc) => {
      console.log(doc.data());
      companys.push({
        ...doc.data(),
        id: doc.id,
      } as ProductDetail);
    });
    return companys;
  }

  async getProductsByCompany(companyId: string) {
    let collectionData: ProductDetail[] = [];
    const queryConditions: QueryConstraint[] = [];

    if (companyId) {
      queryConditions.push(where('companyId', '==', companyId));
    }

    // Create a query against the collection.
    const q = query(
      this.firestoreService.productCollectionInstance,
      ...queryConditions
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      collectionData.push({
        ...doc.data(),
        id: doc.id,
      } as ProductDetail);
    });
    return collectionData;
  }

  updateProduct(details: ProductDetail) {
    return updateDoc(
      doc(
        this.firestoreService.firestore,
        AppConstant.PRODUCT_COLLECTION_NAME,
        details.id
      ),
      {
        ...details,
      }
    );
  }

  deleteProduct(docId: string) {
    const docRef = doc(
      this.firestoreService.firestore,
      AppConstant.PRODUCT_COLLECTION_NAME,
      docId
    );
    return deleteDoc(docRef);
  }
}
