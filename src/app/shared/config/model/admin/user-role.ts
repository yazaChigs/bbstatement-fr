import { BaseModel } from 'src/app/shared/shared-model/base.model';

export class UserRole extends BaseModel{
    name: string;
    description: string;
    selected: boolean;
    printName: string;
}
