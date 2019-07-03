import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { NgxPermissionsService } from 'ngx-permissions';
import { StorageKey } from 'src/app/util/key';
import { BaseAdminComponent } from '../base-admin/base-admin.component';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent extends BaseAdminComponent implements OnInit {
  column = 3;
  fontSize;
  iconSize;
  roles: string[];

  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        this.column = 1;
        this.fontSize = 'font-size-small';
        this.iconSize = 'icon-size-small';
        return [
          // { title: 'Users', cols: 1, rows: 1, icon: 'supervisor_account', link: '/admin/user', name: 'users' },
          // { title: 'Observation Forms', cols: 1, rows: 1, icon: 'ballot', link: '/admin/obs-forms', name: 'forms' },
          // { title: 'Laboratory', cols: 1, rows: 1, icon: 'streetview', link: '/admin/lab', name: 'lab' },
          // { title: 'Radiology', cols: 1, rows: 1, icon: 'nature_people', link: '/admin/radiology', name: 'rad' },
          { title: 'Text and Emails', cols: 1, rows: 1, icon: 'email', link: '/admin/email', name: 'emails' },
          // { title: 'Consultation', cols: 1, rows: 1, icon: 'transfer_within_a_station', link: '/admin/consultation', name: 'cons' },
          { title: 'Billing', cols: 1, rows: 1, icon: 'attach_money', link: '/admin/billing', name: 'bill' },

        ];
      }
      this.column = 3;
      this.fontSize = 'font-size-large';
      this.iconSize = 'icon-size-large';

      return [
        // { title: 'Users', cols: 1, rows: 1, icon: 'supervisor_account', link: '/admin/user', name: 'users' },
        // { title: 'Observation Forms', cols: 1, rows: 1, icon: 'ballot', link: '/admin/obs-forms', name: 'forms' },
        // { title: 'Laboratory', cols: 1, rows: 1, icon: 'streetview', link: '/admin/lab', name: 'lab' },
        // { title: 'Radiology', cols: 1, rows: 1, icon: 'nature_people', link: '/admin/radiology', name: 'rad' },
        { title: 'Text and Emails', cols: 1, rows: 1, icon: 'email', link: '/admin/email', name: 'emails' },
        // { title: 'Consultation', cols: 1, rows: 1, icon: 'transfer_within_a_station', link: '/admin/consultation', name: 'cons' },
        { title: 'Billing', cols: 1, rows: 1, icon: 'attach_money', link: '/admin/billing', name: 'bill' },
      ];
    })
  );
  constructor(private breakpointObserver: BreakpointObserver, public router: Router,
              private permissionsService: NgxPermissionsService)  {
                super(router);
    }

  ngOnInit() {
    this.roles  = JSON.parse(sessionStorage.getItem(StorageKey.GRANTED_AUTHORITIES));
    this.permissionsService.loadPermissions(this.roles);
  }
  redirect(value) {
    this.router.navigate([value]);
  }
}
