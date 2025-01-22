import { Component } from '@angular/core';
import { meAPIUtility } from '../../../shared/site-variables';

@Component({
  selector: 'app-items-home',
  templateUrl: './items-home.component.html',
  styleUrl: './items-home.component.css'
})
export class ItemsHomeComponent {
  managementPages = [
    {name: 'Items' , href: `items`},

  ]
  constructor(private meUtility: meAPIUtility){}

  ngOnInit() {
    this.meUtility.getCommonData().subscribe(
      (data: any) => {
        if(data['role'].toLowerCase() == 'manager' && !data.is_distributors_team){
          this.managementPages.push({name: 'Distributor stock', href: "distributor-items"})
        }
      }
    )
  }
}
