import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeptList } from './dept-list';

describe('DeptList', () => {
  let component: DeptList;
  let fixture: ComponentFixture<DeptList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeptList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeptList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
