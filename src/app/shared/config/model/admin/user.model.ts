
import { UserRole } from './user-role';
import { Gender } from 'src/app/shared/enums/gender';
import { BaseModel } from 'src/app/shared/shared-model/base.model';
import { Branch } from './branch.model';


export class User extends BaseModel {
  userName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  password: string;
  branch: Branch;
  gender: Gender;
  userRoles: UserRole[];
  dob: Date;
  nationalId: string;
  phoneHome: string;
  phoneCell: string;
  phoneBusiness: string;
  address: string;
  country: string;
  dateOfBirth: string;

}
