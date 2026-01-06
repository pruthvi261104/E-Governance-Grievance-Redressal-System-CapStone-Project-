import { TestBed } from '@angular/core/testing';

import { DeptOfficer } from './dept-officer';

describe('DeptOfficer', () => {
  let service: DeptOfficer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeptOfficer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
