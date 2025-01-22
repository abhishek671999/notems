import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { meAPIUtility } from '../../shared/site-variables';
import { LoginService } from '../../shared/services/register/login.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PopUpMsgComponent } from '../shared/pop-up-msg/pop-up-msg.component';

@Component({
  selector: 'app-post-login',
  templateUrl: './post-login.component.html',
  styleUrl: './post-login.component.css',
  standalone: true,
  imports: [MatProgressSpinnerModule, CommonModule]
})
export class PostLoginComponent {

  constructor(
    private router: Router,
    public meAPIUtility: meAPIUtility,
    public loginService: LoginService,
    private matdialog: MatDialog,
  ) { }
  showSpinner = true
  errorOccured = false
  myInfo: any;
  ngOnInit() {
    this.meAPIUtility.getMeData().subscribe((data: any) => {
      this.myInfo = data;
      if (this.myInfo['first_name']) {
        if (this.myInfo['organizations'].length > 0) {
          this.meAPIUtility.setOrganization(this.myInfo['organizations'][0])
          if (String(this.myInfo['organizations'][0]['role']).toLowerCase() == 'manager') {
            this.router.navigate(['manager/attendence/attendence']);
          }
          else {
            debugger
            alert('Unknow error in redirection')
          }
        } else if (this.myInfo['teams'].length > 0) {
          this.meAPIUtility.setTeam(this.myInfo['teams'][0])
          if (String(this.myInfo['teams'][0]['role']).toLowerCase() == 'team member') {
            if(this.myInfo['teams'][0].is_distributors_team) this.router.navigate(['./staff/beats'])
            else this.router.navigate(['staff/attendence'])
          } else if(String(this.myInfo['teams'][0]['role']).toLowerCase() == 'manager'){
            this.router.navigate(['manager/task/tasks'])            
          }
          else{
            debugger
            alert('Unknow error in redirection')
          } 
        }
        else {
          this.matdialog.open(PopUpMsgComponent, { data: { title: 'Team not assigned', content: 'Please contact admin' } })
          this.showSpinner = false;
          this.errorOccured = true;
          this.router.navigate(['profile'])
        }
      } else {
        this.router.navigate(['profile'])
      }  
      this.showSpinner = false;
    },
      (error: any) => {
      alert('Me api load failed')
    });
      
  }
}
