import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,NavbarComponent],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent {
  editForm!: FormGroup;
  role:string="";
  constructor(private fb: FormBuilder,private authService:AuthService,private router:Router) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      phone: ['',Validators.required],
      address: ['',Validators.required],
      pinCode: ['',Validators.required]
    });

    // Optionally, pre-fill form with user data for editing
    this.loadUserData();
  }

  loadUserData(): void {
    // Example user data - replace with real data fetching logic
    const user = this.authService.currentUser;
    if(user){
    const userData = {
      username: user?.username,
      email: user?.email,
      role: user?.role,
      phone: user?.phone,
      address: user?.address,
      pinCode: user?.pinCode
    };
    console.log("UserData",this.authService.currentUser)
    console.log(this.authService.currentUser?.pinCode)
    console.log("Current User Object:", userData);
    this.role = user?.role;
    this.editForm.patchValue(userData);
  }
  }

  onSubmit(): void {
    console.log(this.editForm.valid)
    if (this.editForm.valid) {
      this.authService.updateUser(this.editForm.value);
      console.log('Updated User Data:', this.editForm.value);
      if(this.role!=this.editForm.value.role){
        alert("User Updated Successfully")
        this.authService.signOut();
      }
      this.router.navigateByUrl(`dashboard/${this.role}`)
    } else {
      this.editForm.markAllAsTouched(); 
    }
  }
}
