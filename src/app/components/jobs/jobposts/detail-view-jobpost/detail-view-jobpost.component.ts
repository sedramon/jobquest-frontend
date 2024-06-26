import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MaterialModule } from '../../../../app.material.module';

@Component({
  selector: 'app-detail-view-jobpost',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './detail-view-jobpost.component.html',
  styleUrl: './detail-view-jobpost.component.scss'
})
export class DetailViewJobpostComponent {

}
