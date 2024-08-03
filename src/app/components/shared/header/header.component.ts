import { Component } from '@angular/core';
import { LoginService } from '../../../shared/services/register/login.service';
import { Router } from '@angular/router';
import { meAPIUtility, sessionWrapper } from '../../../shared/site-variables';


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
        action: () => this.router.navigate(['./manager/analytics'])
      },
      'attendence': {
        name: 'Attendence',
        action: () => this.router.navigate(['./manager/attendence/leave'])
      },
      'customer_manager': {
        name: 'Customer',
        action : () => this.router.navigate(['./manager/client/customers'])
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
  

  addStaffNavOptions(organaization: any){
    let staffNavOptions = ['profile' ,'staff_task_management', 'staff_attendence']
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
      console.log(data)
    this.username = data['username'] ? data['username'] : data['email']
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
      //   for(let restaurant of data['restaurants']){
      //     if(restaurant.role_name == 'restaurant_admin'){
      //       this.addRestaurantOwnerNavOptions(restaurant)
      //       break
      //     }else if(restaurant.role_name == 'restaurant_staff'){
      //       this.addRestaurantStaffNavOptions()
      //       break
      //     }
      //   }
      //   if(data['restaurants'].length == 0 && data['companies'].length == 0){
      //     this.addUserNavOptions()
      // }
    })
    
   }  

  onClick(index: number) {
    let checkbox = document.getElementById('hamburger-checkbox') as HTMLInputElement;
    checkbox.checked = false
    this.dropdownList[index].action();
  }
}
