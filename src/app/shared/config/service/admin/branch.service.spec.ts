/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BranchService } from './branch.service';

describe('Service: Branch', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BranchService]
    });
  });

  it('should ...', inject([BranchService], (service: BranchService) => {
    expect(service).toBeTruthy();
  }));
});
