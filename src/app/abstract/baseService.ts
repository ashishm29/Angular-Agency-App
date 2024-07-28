import {
  addDoc,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';

export abstract class BaseService {
  collectionName!: CollectionReference<DocumentData>;

  add(details: any) {
    return addDoc(this.collectionName, details);
  }

  async get() {
    let routes: any[] = [];
    const docsSnap = await getDocs(this.collectionName);
    docsSnap.forEach((doc) => {
      routes.push({
        ...doc.data(),
        id: doc.id,
      } as any);
    });
    return routes;
  }

  update(details: any) {
    return updateDoc(doc(this.collectionName, details.id), {
      ...details,
    });
  }

  delete(docId: string) {
    const docRef = doc(this.collectionName, docId);
    return deleteDoc(docRef);
  }
}
