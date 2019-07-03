/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DataManagementService } from './dataManagement.service';

describe('Service: DataManagement', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataManagementService]
    });
  });

  it('should ...', inject([DataManagementService], (service: DataManagementService) => {
    expect(service).toBeTruthy();
  }));
});
