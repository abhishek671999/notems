import { Component } from '@angular/core';
import { meAPIUtility } from '../../../../shared/site-variables';
import { Router } from '@angular/router';

@Component({
  selector: 'app-analytics-home',
  templateUrl: './analytics-home.component.html',
  styleUrl: './analytics-home.component.css'
})
export class AnalyticsHomeComponent {
  managementPages: managementPage[] = []

  constructor(
    private meUtilty: meAPIUtility,
    private router: Router
  ){}

  ngOnInit(){
    this.meUtilty.getCommonData().subscribe(
      (data: any) => {
        let role = data['role'].toLowerCase()
        let teamType = data['team_type']?.toLowerCase()
        if(['manager', 'team member'].includes(role) && teamType){
          if(teamType == 'sales'){
            this.managementPages.push( {name: 'Sales Analytics' , href: `sales`})
            this.router.navigate(['./staff/analytics/sales'])
          }else if(teamType == 'marketing'){
            this.managementPages.push({name: 'Marketing Analytics', href: "marketing"} )
            this.router.navigate(['./staff/analytics/marketing'])
          }
        }else if(role == 'manager'){
          this.managementPages = [
            { name: 'Sales Analytics' , href: `sales`},
            { name: 'Marketing Analytics', href: "marketing"},
          ]
        }
      }
    )
  }

}

export type managementPage ={
  name: string,
  href: string
}
