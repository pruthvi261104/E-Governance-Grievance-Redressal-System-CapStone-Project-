import { TestBed } from '@angular/core/testing';

import { Citizen } from './citizen';

describe('Citizen', () => {
  let service: Citizen;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Citizen);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
