import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';

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
  constructor(private fb: FormBuilder,private authService:AuthService) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      phone: ['',Validators.required],
      address: ['',Validators.required],
      pincode: ['',Validators.required]
    });

    // Optionally, pre-fill form with user data for editing
    this.loadUserData();
  }

  loadUserData(): void {
    // Example user data - replace with real data fetching logic
    const userString = sessionStorage.getItem('user');
    if(userString){
      const user = JSON.parse(userString);
    console.log(user,"user")
    const userData = {
      username: user.username,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      pincode: user.pinCode
    };
    this.role=user.role;

    this.editForm.patchValue(userData);
  }
  }

  onSubmit(): void {
    console.log(this.editForm.valid)
    if (this.editForm.valid) {
      this.authService.updateUser(this.editForm.value);
      console.log('Updated User Data:', this.editForm.value);
    } else {
      this.editForm.markAllAsTouched(); 
    }
  }
}
