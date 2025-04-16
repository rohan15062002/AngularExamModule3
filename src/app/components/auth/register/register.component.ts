import { Component } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
} from '@angular/fire/firestore';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  constructor(private firestore:Firestore,
    private fireauth: AuthService,
    private router: Router
    ){}

  registerForm = new FormGroup({
    username: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required]),
    password: new FormControl('',[Validators.required,Validators.minLength(6)]),
    phone:new FormControl('',Validators.required),
    address:new FormControl('',Validators.required),
    pincode:new FormControl('',Validators.required),
    role: new FormControl('',Validators.required),
  })

  async onSubmit() {
    if (this.registerForm.invalid) {
      alert('Please fill out the form correctly.');
      return;
    }
  
    const { username, email, password,phone, address, pincode,role } = this.registerForm.value;

    
  
    try {
      await this.register(username!,email!, password!,phone!,address!,pincode!,role!);
      this.registerForm.reset();
    } catch (error: any) {
      alert(`Registration failed: ${error.message}`);
    }
  }
  
  private async register(username:string,email: string, password: string,phone:string,address:string,pinCode:string,role: string) {
    if (!role || (role !== 'admin' && role !== 'customer')) {
      alert('Please select a valid role: admin or customer.');
      return;
    }
    console.log({username,email,password,role})
    // if (role === 'admin') {
    //   const usersCollection = collection(this.firestore, 'users');
    //   const examinerQuery = query(usersCollection, where('role', '==', 'admin'));
    //   const snapshot = await getDocs(examinerQuery); 
    //   if (!snapshot.empty) {
    //     alert('An admin already exists. Please register as a student.');
    //     return;
    //   }
    // }
  
    try {
      await this.fireauth.register(username,email, password, role,phone,address,pinCode); 
      this.router.navigateByUrl('/login');
    } catch (error: any) {
      throw error; 
    }
  }
}
