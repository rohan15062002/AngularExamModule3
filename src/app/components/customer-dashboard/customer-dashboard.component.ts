import { Component } from '@angular/core';
import { Product } from '../../app.model';
import { ProductsService } from '../../core/services/product.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule,NavbarComponent],
  templateUrl: './customer-dashboard.component.html',
  styleUrl: './customer-dashboard.component.css'
})
export class CustomerDashboardComponent {
  loading = false;
  products:Product[]=[];
  isAdmin!:boolean;
  filteredProducts: Product[] = [];
  constructor(private productService:ProductsService, private router:Router){
  
  }
  
  async ngOnInit(): Promise<void> {
    this.loading=true;
    this.productService.getProductsObservable().subscribe((products:Product[])=>{
      this.products=products;
      this.filteredProducts = this.products.filter(product => product.quantity > 0);
      console.log(this.filteredProducts)
      this.products=this.filteredProducts
      this.loading = false;
    })

  }
  
  view(id:string|undefined){
    this.router.navigate(['/product', id]);
  }
  

  myOrder(){
    return this.router.navigateByUrl('order')
  }

  myCart(){
    return this.router.navigateByUrl('cart')
  }
  viewProduct(arg0: any){
    console.log(arg0)
    console.log("edit")
    this.router.navigateByUrl(`view/${arg0}`)
  }

  deleteTask(product:Product){
    if(product){
    this.productService.deleteProduct(product)
    console.log("delete")
    } 
  }
}
  
