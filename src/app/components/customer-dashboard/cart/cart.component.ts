import { Component } from '@angular/core';
import { ProductsService } from '../../../core/services/product.service';
import { Product, User } from '../../../app.model';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NavbarComponent,CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {

  CartItems:Product[]=[];
  user!:User;

  constructor(private productService:ProductsService){

  }

  ngOnInit(): void {
  this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
  
  if (this.user.email) {
    this.productService.getCartForUser(this.user.email).subscribe((products: Product[]) => {
      this.CartItems = products;
    });
    console.log(this.CartItems)
  } else {
    console.error("User email not found!");
  }
  }

  checkout(item:Product){
    this.productService.checkout(item);
  }

  buy(item:Product){
    this.productService.buy(item);
  }
}
