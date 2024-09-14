import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailViewCompanyJobpostComponent } from './detail-view-company-jobpost.component';

describe('DetailViewCompanyJobpostComponent', () => {
  let component: DetailViewCompanyJobpostComponent;
  let fixture: ComponentFixture<DetailViewCompanyJobpostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailViewCompanyJobpostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailViewCompanyJobpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
