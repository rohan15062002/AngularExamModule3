import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword,Auth,signInWithEmailAndPassword,signOut,UserCredential,User } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';


interface CurrentUser {
  uid: string;
  name:string;
  email: string;
  phone:string;
  address:string;
  pinCode:string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser:CurrentUser|null=null;

  constructor(private auth:Auth, 
    private firestore: Firestore,
    private router: Router
  ) { 
    const user = sessionStorage.getItem('user');
    if(user){
      this.currentUser=JSON.parse(user);
    }
  }

 
  
  async getUserData(email: string): Promise<any> {
    const usersCollection = collection(this.firestore, 'users');
    const q = query(usersCollection, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      console.log("Hello");
      console.log( querySnapshot.docs[0].data())
      return querySnapshot.docs[0].data();
    }

    return null;
  }

  async login(email: string, password: string): Promise<User>{
   try {
    const res:UserCredential= await signInWithEmailAndPassword(this.auth,email,password)
    if(res.user?.emailVerified==false){
      throw new Error('Please verify your email address to login.');
    }
    
    const user = await this.getUserData(email)
    this.currentUser = user;
    sessionStorage.setItem('user', JSON.stringify(user));
   
    return res.user
   } 
   catch (error: any) {
    throw new Error(`Login failed: ${error.message}`);
  }
  }

  async register(username:string,email:string,password:string,role:string,phone:string|null,address:string|null,pinCode:string|null):Promise<void>{
    try {
      const res = await createUserWithEmailAndPassword(this.auth,
      email,
      password);

      const usersCollection = collection(this.firestore,'users')

      await addDoc(usersCollection,{
        uid: res.user.uid,
        username,
        email,
        role,
        phone,
        address,
        pinCode
      })

      const isVerified = await this.sendEmailForVerification(res.user);

    } 
    catch (error:any) {
      throw new Error(`${error.message}`);
    }
  }

  async sendEmailForVerification(user:User):Promise<boolean>{
    let res = false;
    
    await sendEmailVerification(user)
      .then(() => {
        alert('Verification email sent!, Please verify your email address.');
        res = true;
      })
      .catch(() => {
        alert('Unable to send verification email.');
        res = false;
      });
    return res;
  }
  
  async updateUser(updatedUserData: CurrentUser) {
    console.log(updatedUserData,"updated")
    const userRef = collection(this.firestore, `users`);
    const q = query(userRef, where('email', '==', this.currentUser?.email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      throw new Error('User not found with this email');
    }

    const userDoc = querySnapshot.docs[0]; // assuming email is unique
    const userDocRef = doc(this.firestore, 'users', userDoc.id);

    await setDoc(userDocRef, { ...updatedUserData });
  }

  async signOut():Promise<void>{
    await signOut(this.auth);
    sessionStorage.removeItem('user');
    this.currentUser = null;
    console.log('Logged out');
    this.router.navigate(['/login']);
  }

  getLoggedInUser(): User | null {
    return this.auth.currentUser;
  }

  isUserLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  getUserRole(): string | null {
    return this.currentUser?.role || null;
  }

  getUserName(): string|null{
    return this.currentUser?.name || null;
  }

  getUserId():string|null{
    return this.currentUser?.uid || null;
  }
}
