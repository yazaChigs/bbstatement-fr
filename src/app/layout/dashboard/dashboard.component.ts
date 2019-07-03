
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { StorageKey } from 'src/app/util/key';
// import { UserRoleService } from 'src/app/shared/config/service/admin/user-role.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  /** Based on the screen size, switch from standard to one column per row */
  column = 2;
  fontSize;
  iconSize;
  // list: Module[];
  // company = JSON.parse(sessionStorage.getItem(StorageKey.COMPANY_DETAIL));
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      // console.log(this.list);
      if (matches) {
        this.column = 1;
        this.fontSize = 'font-size-small';
        this.iconSize = 'icon-size-small';
        return [
          { title: 'Registration', cols: 1, rows: 1, icon: 'supervisor_account', link: '/patient' },
          { title: 'Appointment Scheduling', cols: 1, rows: 1, icon: 'today', link: '/scheduling' },
          { title: 'Clinical', cols: 1, rows: 1, icon: 'hotel', link: 'patient/clinical'  },
          { title: 'Adminstration', cols: 1, rows: 1, icon: 'apps', link: '/admin'  },
          { title: 'Settings', cols: 1, rows: 1, icon: 'settings', link: ''  }
        ];
      }
      this.column = 2;
      this.fontSize = 'font-size-large';
      this.iconSize = 'icon-size-large';

      return [
        { title: 'Registration', cols: 1, rows: 1, icon: 'supervisor_account', link: '/patient'  },
        { title: 'Appointment Scheduling', cols: 1, rows: 1, icon: 'today', link: '/scheduling'  },
        { title: 'Clinical', cols: 1, rows: 1, icon: 'hotel', link: 'patient/clinical'  },
        { title: 'Adminstration', cols: 1, rows: 1, icon: 'apps', link: '/admin'  },
        { title: 'Settings', cols: 1, rows: 1, icon: 'settings', link: ''  }
      ];
    })
  );


  constructor(private breakpointObserver: BreakpointObserver, private router: Router) { }
  redirect(value) {
    this.router.navigate([value]);
  }

  ngOnInit(): void {
    // this.service.getUserModules().subscribe(result => {
    //   this.list = result;
    //   console.log(this.list);
    // });
  }
}
