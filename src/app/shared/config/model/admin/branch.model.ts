import { BaseModel } from 'src/app/shared/shared-model/base.model';

export class Branch extends BaseModel {
  branchName: string;
  address: string;
  email: string;
  phoneNumber: string;
  officePhone: string;
  staticFacility: string;
  cbd: string;
  mob1: string;
  mob2: string;
  mob3: string;
  minStatic: number;
  minCbd: number;
  minMob1: number;
  minMob2: number;
  minMob3: number;
}
