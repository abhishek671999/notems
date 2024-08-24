import { Component } from '@angular/core';
import { sessionWrapper } from '../../../../shared/site-variables';
import { Router } from '@angular/router';

@Component({
  selector: 'app-analytics-home',
  templateUrl: './analytics-home.component.html',
  styleUrl: './analytics-home.component.css'
})
export class AnalyticsHomeComponent {
  managementPages: managementPage[] = []

  constructor(
    private sessionWrapper: sessionWrapper,
    private router: Router
  ){}

  ngOnInit(){
    if(this.sessionWrapper.isTeamManager()){
      if(this.sessionWrapper.getItem('team_type') == 'sales'){
        this.managementPages.push( {name: 'Sales Analytics' , href: `sales`})
        this.router.navigate(['./staff/analytics/sales'])
      }else if(this.sessionWrapper.getItem('team_type') == 'marketing'){
        this.managementPages.push({name: 'Marketing Analytics', href: "marketing"} )
        this.router.navigate(['./staff/analytics/marketing'])
      }
    }else if(this.sessionWrapper.isOrgManager()){
      this.managementPages.push()
      this.managementPages = [
        { name: 'Sales Analytics' , href: `sales`},
        { name: 'Marketing Analytics', href: "marketing"},
      ]
    }
  }


}

export type managementPage ={
  name: string,
  href: string
}
