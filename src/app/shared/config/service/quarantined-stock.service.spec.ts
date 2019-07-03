/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { QuarantinedStockService } from './quarantined-stock.service';

describe('Service: QuarantinedStock', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuarantinedStockService]
    });
  });

  it('should ...', inject([QuarantinedStockService], (service: QuarantinedStockService) => {
    expect(service).toBeTruthy();
  }));
});
