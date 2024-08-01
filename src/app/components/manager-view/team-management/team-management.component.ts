import { Component } from '@angular/core';
import { TeamManagementService } from '../../../shared/services/team-management/team-management.service';
import { HttpParams } from '@angular/common/http';


@Component({
  selector: 'app-team-management',
  templateUrl: './team-management.component.html',
  styleUrl: './team-management.component.css'
})
export class TeamManagementComponent {

  constructor(private teammanagementService: TeamManagementService) { }

  ngOnInit() {
    let httpParams = new HttpParams()
    // httpParams = httpParams.append('team_id', this.session)
    // this.teammanagementService.getUsers().subscribe()
  }


  addTeam() {
    
  }
}
