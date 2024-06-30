import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { MaterialModule } from '../../app.material.module';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  navbarfixed:boolean = false;
  currentUser = this.authService.currentUserValue;

  constructor(private authService: AuthenticationService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/']); // Redirect to login page
  }


  @HostListener('window:scroll', ['$event']) 
  onScroll() {
    if(window.scrollY > 100) {
      this.navbarfixed = true;
    } else {
      this.navbarfixed = false;
    }
  }
}
