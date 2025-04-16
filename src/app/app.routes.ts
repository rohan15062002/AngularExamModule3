import { Routes } from '@angular/router';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { AddItemComponent } from './components/admin-dashboard/add-item/add-item.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { EditItemComponent } from './components/admin-dashboard/edit-item/edit-item.component';
import { CustomerDashboardComponent } from './components/customer-dashboard/customer-dashboard.component';
import { OrderComponent } from './shared/order/order.component';
import { ProductComponent } from './components/customer-dashboard/product/product.component';
import { CartComponent } from './components/customer-dashboard/cart/cart.component';

export const routes: Routes = [
    {path:"register",component:RegisterComponent},
    {path:"login",component:LoginComponent},
    {path:"add",component:AddItemComponent},
    {path:'dashboard/admin',component:AdminDashboardComponent},
    {path:'dashboard/customer',component:CustomerDashboardComponent},
    {path:'edit/:id',component:EditItemComponent},
    {path:'order',component:OrderComponent},
    {path:'view/:id',component:ProductComponent},
    {path:'cart',component:CartComponent}
    
];
