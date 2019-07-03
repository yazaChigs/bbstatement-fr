import { User } from '../config/model/admin/user.model';

export class BaseModel {
  id: number;
  createdById: number;
  createdByName: string;
  version: number;
  dateCreated: Date;
}
