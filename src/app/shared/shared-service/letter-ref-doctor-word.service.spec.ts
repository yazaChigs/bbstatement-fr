import { TestBed } from '@angular/core/testing';

import { LetterRefDoctorWordService } from './letter-ref-doctor-word.service';

describe('LetterRefDoctorWordService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LetterRefDoctorWordService = TestBed.get(LetterRefDoctorWordService);
    expect(service).toBeTruthy();
  });
});
