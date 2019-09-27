import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { BranchService } from '../../../shared/config/service/admin/branch.service';
import { SnotifyService } from 'ng-snotify';
import { NotifyUtil } from 'src/app/util/notifyutil';
import { Router } from '@angular/router';
import { from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Branch } from 'src/app/shared/config/model/admin/branch.model';
import { error } from '@angular/compiler/src/util';

@Component({
  selector: 'app-branch',
  templateUrl: './branch.component.html',
  styleUrls: ['./branch.component.css']
})
export class BranchComponent implements OnInit {
  branchForm: FormGroup;
  util;
  branchToEdit: Branch;

  constructor(private router: Router, private fb: FormBuilder, private service: BranchService,  private snotify: SnotifyService) { }

  ngOnInit() {
    this.createForms();
    this.util = new NotifyUtil(this.snotify);
    this.getBranchToEdit();
  }

    createForms() {
      this.branchForm = this.fb.group({
        id: new FormControl(),
      timeCreated: new FormControl(),
      dateCreated: new FormControl(),
      version: new FormControl(),
      createdById: new FormControl(),
      branchName: new FormControl(),
      address: new FormControl(),
      email: new FormControl(),
      phoneNumber: new FormControl(),
      officePhone: new FormControl(),
      staticFacility: new FormControl(),
      cbd: new FormControl(),
      mob1: new FormControl(),
      mob2: new FormControl(),
      mob3: new FormControl(),
      minStatic: new FormControl(),
      minCbd: new FormControl(),
      minMob1: new FormControl(),
      minMob2: new FormControl(),
      minMob3: new FormControl(),
      });
    }
    populateForm(branchToEdit: Branch) {
      this.branchForm.get('id').setValue(this.branchToEdit.id);
      this.branchForm.get('version').setValue(this.branchToEdit.version);
      this.branchForm.get('dateCreated').setValue(this.branchToEdit.dateCreated);
      this.branchForm.get('createdById').setValue(this.branchToEdit.createdById);
      this.branchForm.get('branchName').setValue(this.branchToEdit.branchName);
      this.branchForm.get('address').setValue(this.branchToEdit.address);
      this.branchForm.get('email').setValue(this.branchToEdit.email);
      this.branchForm.get('phoneNumber').setValue(this.branchToEdit.phoneNumber);
      this.branchForm.get('officePhone').setValue(this.branchToEdit.officePhone);
      this.branchForm.get('staticFacility').setValue(this.branchToEdit.staticFacility);
      this.branchForm.get('cbd').setValue(this.branchToEdit.cbd);
      this.branchForm.get('mob1').setValue(this.branchToEdit.mob1);
      this.branchForm.get('mob2').setValue(this.branchToEdit.mob2);
      this.branchForm.get('mob3').setValue(this.branchToEdit.mob3);
      this.branchForm.get('minStatic').setValue(this.branchToEdit.minStatic);
      this.branchForm.get('minCbd').setValue(this.branchToEdit.minCbd);
      this.branchForm.get('minMob1').setValue(this.branchToEdit.minMob1);
      this.branchForm.get('minMob2').setValue(this.branchToEdit.minMob2);
      this.branchForm.get('minMob3').setValue(this.branchToEdit.minMob3);
  }

getBranchToEdit() {
  this.service.getBranch().subscribe(
    branch => {
    this.branchToEdit = branch;
    }, error => {
      console.log(error.error);
    }
  );
  this.populateForm(this.branchToEdit);
}

    submitValues(value) {
      if (value.staticDacility === '') {value.staticDacility = null; }
      if (value.cbd === '') {value.cbd = null; }
      if (value.mob1 === '') {value.mob1 = null; }
      if (value.mob2 === '') {value.mob2 = null; }
      if (value.mob3 === '') {value.mob3 = null; }
      this.service.save(value).subscribe(
        result => {
          this.snotify.success(
            result.message,
            'Success',
            this.util.getNotifyConfig()
          );
          this.router.navigate(['/admin/branch-list']);
        },
        error => {
          this.snotify.error(
            'Error Encountered',
            'Error',
            this.util.getNotifyConfig()
          );
        }
      );
  }

}
