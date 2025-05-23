import { Component } from '@angular/core';
import { Product } from '../../../app.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from 'firebase/auth';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../shared/navbar/navbar.component';
import { merge } from 'rxjs';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule,NavbarComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  productId: string | null = null;
  product: Product | undefined;
  user: User | null = null;
  role:string="";
  count:number=0;

  constructor(private route: ActivatedRoute, private productService:ProductsService, private authService: AuthService,
    private router:Router) {};

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');

    if (this.productId) {
      this.productService.getProductById(this.productId).subscribe((product)=>{
        this.product=product;
      });
    }

    const user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.role=user.role
    if(user){
      this.user=user;
      console.log(user);
    }
  }

 async increaseQuantity(product:Product){
    if (!this.user) return;
    const role = this.authService.getUserRole();
    if(role=='admin'){
      console.log("admin role");
      product.quantity++;
      this.productService.updateProduct(product);
    } else {
      if(product.quantity>0){
        product.quantity--;
        this.count++ 
        if(product.quantity===0){
          this.productService.updateProduct({...product,status:"Not Available"}); 
        }
        if(product.quantity>0){
          this.productService.updateProduct({...product,status:"Available"}); 
        }
        this.productService.addToCart({...product,quantity:this.count});
        this.productService.updateCartProductQuantity(product, 1);
        } 
    }

    // this.userService.isAdmin(this.fireStore).then(isAdmin => {
    //   if (isAdmin) {
    //   console.log("admin role");
    //   product.quantity++;
    //   this.productService.updateProduct(product);
    //   } else {
    //     if(product.quantity>0){
    //       product.quantity--;
    //       this.productService.updateProduct(product); 
    //       this.productService.addToCart(product);
    //       this.productService.updateCartProductQuantity(product, 1);
    //       } 
    //   }
    // });
    
  }

 async decreaseQuantity(product:Product){
    if (!this.user) return;
    const role = this.authService.getUserRole();
    
    if(role=='admin'){
      if (product.quantity > 0) {
        product.quantity--;
        if (product.quantity === 0) {
          this.productService.deleteProduct(product);
          this.router.navigateByUrl("/dashboard/admin")
        } else {
          this.productService.updateProduct(product);
        }
    }
    else {
      this.productService.updateCartProductQuantity(product, -1);
    }
    }
    else{
      if(this.count==0){
        alert("cannot deceases")
        return;
      }
      this.count--;
      product.quantity++;
      if(product.quantity===0){
        this.productService.updateProduct({...product,status:"not available"}); 
      }
      if(product.quantity>0){
        this.productService.updateProduct({...product,status:"available"}); 
      }
      this.productService.addToCart({...product,quantity:this.count});
      this.productService.updateCartProductQuantity(product, -1);
      
    }
 }

 async update(product:Product){
  this.productService.updateProduct(product);
  alert("Product Quantity Updated")
 }
}
