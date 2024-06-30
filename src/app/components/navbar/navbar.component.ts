import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { MaterialModule } from '../../app.material.module';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MaterialModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  navbarfixed:boolean = false;


  @HostListener('window:scroll', ['$event']) 
  onScroll() {
    if(window.scrollY > 100) {
      this.navbarfixed = true;
    } else {
      this.navbarfixed = false;
    }
  }
}
