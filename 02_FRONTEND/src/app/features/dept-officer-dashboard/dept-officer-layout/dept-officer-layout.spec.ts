import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeptOfficerLayout } from './dept-officer-layout';

describe('DeptOfficerLayout', () => {
  let component: DeptOfficerLayout;
  let fixture: ComponentFixture<DeptOfficerLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeptOfficerLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeptOfficerLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
