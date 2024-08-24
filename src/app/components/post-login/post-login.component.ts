import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectcomponentsService } from '../../shared/services/connectcomponents.service';
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
    private cc: ConnectcomponentsService, 
    public meAPIUtility: meAPIUtility,
    public loginService: LoginService,
    private matdialog: MatDialog
  ) { }
  showSpinner = true
  errorOccured = false
  myInfo: any;
  ngOnInit() {
    this.meAPIUtility.getMeData().subscribe((data: any) => {
      this.myInfo = data;
      sessionStorage.setItem('user_id', data['user_id'])
      if (this.myInfo['first_name']) {
        if (this.myInfo['organizations'].length > 0) {
          sessionStorage.setItem('organization_id', this.myInfo['organizations'][0]['organization_id'])  //hardcode
          sessionStorage.setItem('organization_name', this.myInfo['organizations'][0]['organization_name']
          );
          if (String(this.myInfo['organizations'][0]['role']).toLowerCase() == 'manager') {
            sessionStorage.setItem('is_org_manager', 'true')
            this.router.navigate(['manager/attendence/attendence']);
          }
          else alert('Unknow error in redirection')
        } else if (this.myInfo['teams'].length > 0) {
          if (String(this.myInfo['teams'][0]['role']).toLowerCase() == 'team member') {
            sessionStorage.setItem('organization_id', this.myInfo['teams'][0]['organization_id'])  //hardcode
            sessionStorage.setItem('is_team_member', 'true')
            this.router.navigate(['staff/attendence'])
          } else if(String(this.myInfo['teams'][0]['role']).toLowerCase() == 'manager'){
            sessionStorage.setItem('organization_id', this.myInfo['teams'][0]['organization_id'])  //hardcode
            sessionStorage.setItem('is_team_manager', 'true')
            sessionStorage.setItem('team_type', this.myInfo['teams'][0]['team_type'].toLowerCase())
            this.router.navigate(['manager/task/tasks'])            
          }
          else alert('Unknow error in redirection')
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
      error => {
      alert('Me api load failed')
    });
      
  }
}
