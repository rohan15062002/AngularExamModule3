import { Component } from '@angular/core';
import { ProductsService } from '../../../core/services/product.service';
import { Product, User } from '../../../app.model';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
  loading=false;
  constructor(private productService:ProductsService,private router:Router){

  }

  ngOnInit(): void {
  this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
  this.loading=true;
  if (this.user.email) {
    this.productService.getCartForUser(this.user.email).subscribe((products: Product[]) => {
      this.CartItems = products;
      this.loading=false;
    });
    console.log(this.CartItems)
  } else {
    console.error("User email not found!");
  }
  }

  checkout(item:Product){
    console.log(item.id)
    this.productService.checkout(item);
    console.log("check out done")
  }

  buy(item:Product){
    this.productService.buy(item);
    this.router.navigateByUrl('order')
  }
}
