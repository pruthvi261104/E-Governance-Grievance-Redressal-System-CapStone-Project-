import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseGrievance } from './close-grievance';

describe('CloseGrievance', () => {
  let component: CloseGrievance;
  let fixture: ComponentFixture<CloseGrievance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloseGrievance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloseGrievance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
