import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolutionProgress } from './resolution-progress';

describe('ResolutionProgress', () => {
  let component: ResolutionProgress;
  let fixture: ComponentFixture<ResolutionProgress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResolutionProgress]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResolutionProgress);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
