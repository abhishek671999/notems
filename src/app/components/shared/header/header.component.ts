import { Component } from '@angular/core';
import { LoginService } from '../../../shared/services/register/login.service';
import { Router } from '@angular/router';
import { meAPIUtility, sessionWrapper } from '../../../shared/site-variables';
import { team } from '../../../shared/custom_dtypes/team';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(
    private _loginService: LoginService, 
    private router: Router,
    private _meAPIutility: meAPIUtility,
  ) {
    }
    AvailableDropdownList: any = {
      'profile': {
        name: 'Profile',
        action: () => this.router.navigate(['./profile'])
      },
      'analytics': {
        name: 'Analytics',
        action: () => this.router.navigate(['./manager/analytics/sales'])
      },
      'attendence': {
        name: 'Attendence',
        action: () => this.router.navigate(['./manager/attendence/leave'])
      },
      'customer_manager': {
        name: 'Customer',
        action : () => this.router.navigate(['./manager/customers'])
      },
      'items_manager': {
        name: 'Items',
        action: () => this.router.navigate(['./manager/items'])
      },
      'team_management': {
        name: 'Team management',
        action: () => this.router.navigate(['./manager/team-management'])
      },
      'task_management': {
        name: 'Task management',
        action: () => this.router.navigate(['./manager/task/tasks'])
      },
      'staff_task_management': {
        name: 'Beats',
        action: () => this.router.navigate(['./staff/beats'])
      },
      'staff_attendence': {
        name: 'Attendence',
        action: () => this.router.navigate(['./staff/attendence'])
      },
      'staff_analytics': {
          name: 'Analytics',
          action: () => this.router.navigate(['./staff/analytics/sales'])
      },
      'staff_leave_history': {
        name: 'Leave history',
        action: () => this.router.navigate(['./staff/leave-history'])
      },
      'logout': {
        name: 'Logout',
        action: () => this._loginService.logOut(),
      },
      'support': {
        name: 'Support',
        action: () => this.router.navigate(['./user/support'])
      },
      'calendar': {
        name: 'Calendar',
        action: () => this.router.navigate(['./manager/calendar'])
      }


    }
  
    addManagerNavOptions(organaization: any){
      this.location = organaization.organization_name
      let managerNavOptions: Array<string>
      managerNavOptions = ['profile', 'calendar', 'analytics','task_management', 'team_management', 'attendence', 'customer_manager', 'items_manager']
      for(let option of managerNavOptions){
        if(this.dropdownList.indexOf(this.AvailableDropdownList[option]) === -1){
          this.dropdownList.splice(0, 0, this.AvailableDropdownList[option])
        }
      }
    }

    addTeamManagerNavOptions(team: team){
      let teamManagerNavOptions = ['profile', 'staff_task_management', 'staff_analytics', 'staff_attendence', 'staff_leave_history']
      for(let option of teamManagerNavOptions){
        if(this.dropdownList.indexOf(this.AvailableDropdownList[option]) === -1){
          this.dropdownList.splice(0, 0, this.AvailableDropdownList[option])
        }
      }
    }
  

  addStaffNavOptions(team: any){
    let staffNavOptions = ['profile' ,'staff_task_management','staff_analytics', 'staff_attendence', 'staff_leave_history']
    for(let option of staffNavOptions){
      if(this.dropdownList.indexOf(this.AvailableDropdownList[option]) === -1){
        this.dropdownList.splice(0, 0, this.AvailableDropdownList[option])
      }
    }
  }

    
  dropdownList = [ this.AvailableDropdownList['logout']]
  username: string = ''
  message: string = ''
  location: string = ''


  ngOnInit(){
    this._meAPIutility.getMeData().subscribe((data: any) => {
      this.username = data['username'] ? data['username'] : data['email']
      if(data['organizations'].length > 0){
        for(let organaization of data['organizations']){
          if(organaization.role.toLowerCase() == 'manager'){
            this.addManagerNavOptions(organaization)
            break
          }
          if (organaization.role.toLowerCase() == 'team member') {
            this.addStaffNavOptions(organaization)
            break
          }
        }
      }else if(data['teams'].length > 0){
        for(let team of data['teams']){
          if(team.role.toLowerCase() == 'manager'){
            this.addTeamManagerNavOptions(team)
            break
          }else if(team.role.toLowerCase() == 'team member'){
            this.addStaffNavOptions(team)
            break
          }
        }
      }
    })
    
   }  

  onClick(index: number) {
    let checkbox = document.getElementById('hamburger-checkbox') as HTMLInputElement;
    checkbox.checked = false
    this.dropdownList[index].action();
  }
}
