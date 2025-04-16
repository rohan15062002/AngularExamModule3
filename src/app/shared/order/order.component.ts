import { Component } from '@angular/core';
import { Product, User } from '../../app.model';
import { ProductsService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule, NgIf } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule,NavbarComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {

  orders: Product[]=[];
  user!:User;
  userName!: string;
  isAdminRole!:string|null

  constructor(private productService:ProductsService, private authService:AuthService,){};

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('user') || '{}');
    this.userName = this.user?.username;
    console.log(this.userName);
    console.log(this.user)
    this.verifyAdminRole();
  }

  async verifyAdminRole() {
    try {
      this.isAdminRole = this.authService.getUserRole();
      if (this.isAdminRole=='admin') {
        this.productService.getOrders().subscribe((products: Product[]) => {
          this.orders = products;
        });
      } 
      else if (this.user.email) {
        this.productService.getOrdersForUser(this.user.email).subscribe((products: Product[]) => {
          this.orders = products;
        });
      } 
    } catch (error) {
      console.error("Error verifying admin role:", error);
    }
  }
  
  updateOrderStatus(order: Product, event: Event) {
    console.log("Updated event", event);
    const newStatus = (event.target as HTMLSelectElement).value;
    console.log("New Status is", newStatus);
    order.status = newStatus;
    this.productService.updateOrder(order);
  }
  
}