import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailViewJobpostComponent } from './detail-view-jobpost.component';

describe('DetailViewJobpostComponent', () => {
  let component: DetailViewJobpostComponent;
  let fixture: ComponentFixture<DetailViewJobpostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailViewJobpostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailViewJobpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
