import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from '../../app.material.module';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {

}
