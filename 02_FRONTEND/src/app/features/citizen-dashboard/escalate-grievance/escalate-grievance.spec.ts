import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscalateGrievance } from './escalate-grievance';

describe('EscalateGrievance', () => {
  let component: EscalateGrievance;
  let fixture: ComponentFixture<EscalateGrievance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EscalateGrievance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EscalateGrievance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
