import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { AppConstant } from '../appConstant';
import { deleteDoc, doc, getDocs, setDoc, updateDoc } from '@angular/fire/firestore';
import { Route } from '../models/route';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  constructor(private firestoreService: FirestoreService) {}

  async getRoutes() {

    let routes: Route[] = [];
    const docsSnap = await getDocs(this.firestoreService.routeCollectionInstance);
    docsSnap.forEach((doc) => {
      console.log(doc.data());
      routes.push({
        ...doc.data(),
        id: doc.id,
      } as Route);
    });
    console.log(JSON.stringify(routes));
    return routes;
  }

  addRoute(route: Route) {
    return setDoc(
      doc(
        this.firestoreService.firestore,
        AppConstant.ROUTE_COLLECTION_NAME,
        route.routeName.toLowerCase()
      ),
      route
    );
  }

  updateRoute(details: Route) {
    return updateDoc(
      doc(
        this.firestoreService.firestore,
        AppConstant.ROUTE_COLLECTION_NAME,
        details.id
      ),
      {
        ...details,
      }
    );
  }

  deleteRoute(docId: string) {
    const docRef = doc(
      this.firestoreService.firestore,
      AppConstant.ROUTE_COLLECTION_NAME,
      docId
    );
    return deleteDoc(docRef);
  }
}
