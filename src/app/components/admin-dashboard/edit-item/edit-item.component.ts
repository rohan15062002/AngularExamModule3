import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../../core/services/product.service';
import { Product } from '../../../app.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-item',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './edit-item.component.html',
  styleUrl: './edit-item.component.css',
})
export class EditItemComponent {
  productForm!: FormGroup;
  productId: string = '';
  loading = false;
  productDetails!: Product;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private productService: ProductsService
  ) {
    this.loading = true;
    this.productId = this.activatedRoute.snapshot.params['id'];

    this.productService.getProductById(this.productId).subscribe(
      (product) => {
        if (!product) {
          this.router.navigate(['/']);
          return;
        }
        this.productDetails = product;
        this.productForm = this.fb.group({
          name: [product.name, [Validators.required, Validators.minLength(3)]],
          description: [product.description, [Validators.required]],
          quantity: [product.quantity, [Validators.required, Validators.min(0)]],
        });
        this.loading = false;
      },
      (error) => {
        console.error('Error:', error);
        this.loading = false;
      }
    );
  }

  onSubmit() {
    if (this.productForm.invalid) return;

    const updatedProduct: Product = {
      ...this.productDetails,
      name: this.productForm.value.name,
      description: this.productForm.value.description,
      quantity: this.productForm.value.quantity,
    };

    this.productService.updateProduct(updatedProduct).then(() => {
      console.log('Product updated successfully');
      this.router.navigate(['/']);
    }).catch((error) => {
      console.error('Error updating product:', error);
    });
  }
}
