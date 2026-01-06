import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentPerformance } from './department-performance';

describe('DepartmentPerformance', () => {
  let component: DepartmentPerformance;
  let fixture: ComponentFixture<DepartmentPerformance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentPerformance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentPerformance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
