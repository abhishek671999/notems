import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectcomponentsService } from '../../shared/services/connectcomponents.service';
import { meAPIUtility } from '../../shared/site-variables';
import { LoginService } from '../../shared/services/register/login.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-login',
  templateUrl: './post-login.component.html',
  styleUrl: './post-login.component.css',
  standalone: true,
  imports: [MatProgressSpinnerModule, CommonModule]
})
export class PostLoginComponent {

  constructor(
    private _router: Router,
    private _cc: ConnectcomponentsService, 
    public meAPIUtility: meAPIUtility,
    public loginService: LoginService
  ) { }
  showSpinner = true
  errorOccured = false
  myInfo: any;
  ngOnInit() {
    this.meAPIUtility.getMeData().subscribe((data: any) => {
      this.myInfo = data;
      sessionStorage.setItem('user_id', data['user_id'])
      if (this.myInfo['organizations'].length > 0) {
        sessionStorage.setItem('organization_id', this.myInfo['organizations'][0]['organization_id'])  //hardcode
        sessionStorage.setItem(
          'organization_name',
          this.myInfo['organizations'][0]['organization_name']
        );
        if (String(this.myInfo['organizations'][0]['role']).toLowerCase() == 'manager') this._router.navigate(['manager/attendence']);
        else if (String(this.myInfo['organizations'][0]['role']).toLowerCase() == 'team member') this._router.navigate(['staff/attendence'])
      }
      this.showSpinner = false;
    },
      error => {
      alert('Me api load failed')
    });
      
  }
}
