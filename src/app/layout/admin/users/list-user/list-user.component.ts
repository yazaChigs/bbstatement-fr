import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/config/service/admin/user.service';
import { User } from 'src/app/shared/config/model/admin/user.model';
import { Router } from '@angular/router';
import { SnotifyService, SnotifyToast } from 'ng-snotify';
import { NotifyUtil } from 'src/app/util/notifyutil';
import { MatDialog } from '@angular/material';
import { ChangePasswordDialogComponent } from '../change-password-dialog/change-password-dialog.component';



@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {
  public  = localStorage.getItem('COLOR');
  list: User[];
  util;
  constructor(private userService: UserService, private router: Router, public dialog: MatDialog,
              private snotify: SnotifyService) { }

  ngOnInit() {
    this.util = new NotifyUtil(this.snotify);
    this.fetchUsers();
  }

  fetchUsers() {
  this.userService.getAll().subscribe(
    data => {
    this.list = data;
    console.log(this.list);
    },
  error => {
   console.log(error);
  });
  }


   editUser(userToEdit: any) {
    this.userService.setUser(userToEdit);
    this.router.navigate(['admin/user/edit']);
   }

  deleteUser(id: number, index: number) {
    const noAction = (toast: SnotifyToast) => {
      this.snotify.remove(toast.id);
    };
    const yesAction = (toast: SnotifyToast) => {
        this.deleteItem(id, index);
    };
    this.snotify.confirm('Are you sure?', 'Delete Action', {
      ...this.util.getNotifyConfigPrompt(),
      buttons: [
        {text: 'Yes', action: yesAction, bold: true },
        {text: 'No', action: noAction },
      ],
    });
  }

   /**
   *Event Triggered by Yes Action on confirm Dialog
   */

  deleteItem(id: number, index: number) {
    this.userService.deleteUser(id).subscribe(
      result => {
        this.list = this.list.filter(item => item.id !== id);
        this.snotify.success(result.message, 'Success', this.util.getNotifyConfig());
      },
      error => {
        console.log(error);
      });
  }

  openChangePasswordDialog(value) {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '36%',
      data: value
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.list = this.list.filter(t => t.id !== value.id);
        this.list.push(result.data);
      }
    });
    dialogRef.updatePosition({ top: '80px', right: '10px'});
  }

}
