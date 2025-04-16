import { Component } from '@angular/core';
import { Product } from '../../app.model';
import { ProductsService } from '../../core/services/product.service';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NgFor,NavbarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  loading = false;
  products:Product[]=[];
  isAdmin!:boolean;
  
  constructor(private productService:ProductsService, private router:Router){
  }
  
  async ngOnInit(): Promise<void> {
    this.loading=true;
    this.productService.getProductsObservable().subscribe((products:Product[])=>{
      this.products=products;
      this.loading = false;
    })
  }
  
  view(id:string|undefined){
    this.router.navigate(['/product', id]);
  }
  

  addTask(){
    return this.router.navigateByUrl('add')
  }
  editTask(arg0: any){
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

  viewOrders(){
    return this.router.navigateByUrl('order')
  }
  
  
  }
