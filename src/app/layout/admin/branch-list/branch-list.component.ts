import { Component, OnInit } from '@angular/core';
import { Branch } from '../../../shared/config/model/admin/branch.model';
import { Router } from '@angular/router';
import { BranchService } from '../../../shared/config/service/admin/branch.service';

@Component({
  selector: 'app-branch-list',
  templateUrl: './branch-list.component.html',
  styleUrls: ['./branch-list.component.css']
})
export class BranchListComponent implements OnInit {

  list: Branch[];
  branchToEdit: Branch;

  constructor(public router: Router, private branchService: BranchService) { }

  ngOnInit() {
    this.fetchBranches();
  }

  editBranch(value) {
    console.log(value);
    this.branchService.setBranch(value);
    this.router.navigate(['admin/branch']);
    // this.userService.setUser(userToEdit);
   }
   newBranch() {
     this.router.navigate(['admin/branch']);
   }

   fetchBranches() {
    this.branchService.getAll().subscribe(
      result => {
      this.list = result;
        },
        error => {
          console.log(error);
        });
    }
}
