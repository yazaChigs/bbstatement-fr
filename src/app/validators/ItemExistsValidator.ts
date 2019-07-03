import { FormControl, ValidatorFn, AbstractControl } from '@angular/forms';

export const itemExists = (messages: any[]): any => {
    console.log('Msg');
    for (const msg of messages) {
      console.log('Msg' + msg);
     if (msg.duplicateItem) {
      return {
        itemExist: {valid: false}
     };
   }
     return null;
     }

};
