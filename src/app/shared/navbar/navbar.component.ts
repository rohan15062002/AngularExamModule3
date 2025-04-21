import { Component, Input } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private fireauthService:AuthService,private router:Router){}
  
  @Input()title:string=' '
 
  goHome() {
    const role = this.fireauthService.getUserRole();
    if(role==="admin"){
      this.router.navigateByUrl('dashboard/admin')
    }
    else{
      this.router.navigateByUrl('dashboard/customer')
    }
  }
  logout(){
    this.fireauthService.signOut()
  }
  edit(){
    this.router.navigateByUrl(`edituser/${this.fireauthService.getUserId()}`)
  }
}
