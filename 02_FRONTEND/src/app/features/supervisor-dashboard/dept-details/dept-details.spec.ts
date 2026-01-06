import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeptDetails } from './dept-details';

describe('DeptDetails', () => {
  let component: DeptDetails;
  let fixture: ComponentFixture<DeptDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeptDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeptDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
