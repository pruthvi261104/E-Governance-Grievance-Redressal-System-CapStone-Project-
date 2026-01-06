import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievancesList } from './grievances-list';

describe('GrievancesList', () => {
  let component: GrievancesList;
  let fixture: ComponentFixture<GrievancesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrievancesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrievancesList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
