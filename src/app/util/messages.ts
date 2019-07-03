export class Messages {
  field_required = {
    'field' : [
      { type: 'required', message: 'Field is required'}
    ]
  };
  account_info = {
       'confirmPassword': [
         { type: 'required', message: 'Confirm password is required' },
         { type: 'areEqual', message: 'Password mismatch' }
       ],
       'password': [
         { type: 'required', message: 'Password is required' },
         { type: 'minlength', message: 'Password must be at least 5 characters long' },
         { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number' }
       ]
     };
}
