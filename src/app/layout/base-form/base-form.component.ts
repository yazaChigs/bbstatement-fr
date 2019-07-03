import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-base-form',
  templateUrl: './base-form.component.html',
  styleUrls: ['./base-form.component.css']
})
export class BaseFormComponent implements OnInit {

 /*// @Output() formId = new EventEmitter<FormControl>();
  @Output() formUser = new EventEmitter<FormGroup>();
  userForm: FormGroup;
*/
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
     // this.formId.emit(new FormControl());
    // this.formUser.emit(this.createUserForm());
  }
/*
  createUserForm(): FormGroup {
    this.userForm = new FormGroup({
      id: new FormControl('')
    });
    return this.userForm;
  }
  */

}
