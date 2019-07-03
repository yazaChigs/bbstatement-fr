import { FormGroup, FormControl } from '@angular/forms';



export function userForm(): FormGroup {
  let userFormGroup: FormGroup;
  userFormGroup = new FormGroup({
    id: new FormControl()
  });
  return userFormGroup;
}
