import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewProduct, Product } from '../../../app.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../core/services/product.service';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';

@Component({
  selector: 'app-add-item',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,NavbarComponent],
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.css'
})
export class AddItemComponent {
  addItemForm!: FormGroup;
  products: Product[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productService:ProductsService
  ) {
    this.addItemForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });

  }
  

  // Submit the form
  onSubmit() {
    if (!this.addItemForm.valid) {
      console.log(this.addItemForm.value)
      alert("Form is incorrect");
      return;
    }

    const formData = this.addItemForm.value;
    const productData: NewProduct = {
      name: this.addItemForm.value.name,
      description: this.addItemForm.value.description,
      quantity: this.addItemForm.value.quantity,
      status: "available", 
    };
    console.log(productData)
    this.productService.addProduct(productData);
    this.router.navigateByUrl("/dashboard/admin")
    this.addItemForm.reset();
  }
}