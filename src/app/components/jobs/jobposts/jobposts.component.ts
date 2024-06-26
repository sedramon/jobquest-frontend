import { Component, OnInit } from '@angular/core';
import { JobPost } from '../../../model/JobPost';
import { JobPostService } from '../../../services/jobpost.service';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../app.material.module';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';

@Component({
  selector: 'app-jobposts',
  standalone: true,
  imports: [CommonModule, MaterialModule, MatChipsModule],
  templateUrl: './jobposts.component.html',
  styleUrl: './jobposts.component.scss'
})
export class JobpostsComponent implements OnInit{
    jobPosts: JobPost[] = [];

    constructor(private jobPostService: JobPostService, private router: Router){}

  ngOnInit(): void {
      this.jobPostService.getAllJobPosts().subscribe((response) => {
        this.jobPosts = response;
      })
  }

  apply(jobPostId: string) {
    this.router.navigate(['/jobs', jobPostId])
  }

  truncateDescription(description: string, sentenceLimit: number): string {
    const sentences = description.split('. ');
    if (sentences.length <= sentenceLimit) return description;

    return sentences.slice(0, sentenceLimit).join('. ') + '...';
  }
}
