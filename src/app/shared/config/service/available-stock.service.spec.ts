/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AvailableStockService } from './available-stock.service';

describe('Service: AvailableStock', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AvailableStockService]
    });
  });

  it('should ...', inject([AvailableStockService], (service: AvailableStockService) => {
    expect(service).toBeTruthy();
  }));
});
