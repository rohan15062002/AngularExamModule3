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
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {path:"",redirectTo:'login',pathMatch:'full'},
    {path:"register",component:RegisterComponent},
    {path:"login",component:LoginComponent},
    {
        path: 'dashboard/admin',
        loadComponent: () => import('./components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        canActivate: [AuthGuard],
        data: { role: 'admin' }
      },
      {
        path: 'dashboard/customer',
        loadComponent: () => import('./components/customer-dashboard/customer-dashboard.component').then(m => m.CustomerDashboardComponent),
        canActivate: [AuthGuard],
        data: { role: 'customer' }
      },
    {
        path: 'add',
        loadComponent: () => import('./components/admin-dashboard/add-item/add-item.component').then(m => m.AddItemComponent),
        canActivate: [AuthGuard],
        data: { role: 'admin' }
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./components/admin-dashboard/edit-item/edit-item.component').then(m => m.EditItemComponent),
        canActivate: [AuthGuard],
        data: { role: 'admin' }
    },
    {
        path:'order',
        component:OrderComponent
    },
    {
        path: 'view/:id',
        loadComponent: () => import('./components/customer-dashboard/product/product.component').then(m => m.ProductComponent),
    },
    {
        path: 'cart',
        loadComponent: () => import('./components/customer-dashboard/cart/cart.component').then(m => m.CartComponent),
        canActivate: [AuthGuard],
        data: { role: 'customer' }
    },
    
];
