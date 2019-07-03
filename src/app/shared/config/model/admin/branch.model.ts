import { BaseModel } from 'src/app/shared/shared-model/base.model';

export class Branch extends BaseModel {
  branchName: string;
  address: string;
  email: string;
  phoneNumber: string;
  officePhone: string;
}
