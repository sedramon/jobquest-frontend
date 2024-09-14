import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteJobPostComponent } from './confirm-delete-job-post.component';

describe('ConfirmDeleteJobPostComponent', () => {
  let component: ConfirmDeleteJobPostComponent;
  let fixture: ComponentFixture<ConfirmDeleteJobPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDeleteJobPostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDeleteJobPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
