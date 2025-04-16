import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  Firestore,
  getDocFromServer,
  getDocs,
  setDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: Firestore) { }

  // Add new document
  async addDocument(collectionPath:string,data:any){
    const docRef = collection(this.firestore,collectionPath);
    const doc = await addDoc(docRef,data);
    return doc.id
  }
  

  //update
  async updateDocument(collectionPath: string, data: any) {
    const docRef = doc(this.firestore, collectionPath);
    await setDoc(docRef, data, { merge: true });
  }
  
  //delete
  async deleteDocument(docPath: string) {
    const docRef = doc(this.firestore, docPath);
    await deleteDoc(docRef);
  }

  //get a particular id data 
  async getDocument(docPath:string){
    const docRef = doc(this.firestore,docPath);
    const docSnap = await getDocFromServer(docRef);

    if(docSnap.exists()){
      console.log(docSnap.data)
      return docSnap.data();
    }

    return null;
  }

  // get all collection of user/data
  
  async getCollection(collectionPath: string): Promise<any[]> {
    const usersCollection: CollectionReference = collection(
      this.firestore,
      collectionPath
    );
    const usersSnapshot = await getDocs(usersCollection);
    const usersList = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return usersList;
  }
}
