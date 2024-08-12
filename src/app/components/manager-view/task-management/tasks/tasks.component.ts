import { Component } from '@angular/core';
import { TeamManagementService } from '../../../../shared/services/team-management/team-management.service';
import { HttpParams } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AssignBeatComponent } from '../../dialog-box/assign-beat/assign-beat.component';
import { AssignedBeatsViewComponent } from '../../dialog-box/assigned-beats-view/assigned-beats-view.component';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { beat } from '../../../../shared/custom_dtypes/beats';
import { Router } from '@angular/router';
import { dateUtils } from '../../../../shared/utils/date_utils';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {

  constructor(
    private teamService: TeamManagementService,
    private taskService: TaskManagementService,
    private matDialog: MatDialog,
    private dateUtils: dateUtils,
    private router: Router
  ) { }

  public selectedTeam: any;
  public selectedTeamMember: any;
  public selectedDate = new Date()
  public teams: any;
  public teamMembers: any = []
  public teamMembersSource: any = []
  public savedBeats: any = [];
  public savedBeatsColumns = ['sl_no', 'title', 'reporter', 'description', 'note', 'create_date']

  ngOnInit() {
    this.fetchBeats()

      let httpParams = new HttpParams()
      this.teamService.getMyTeams(httpParams).subscribe(
        (data: any) => {
         this.teams = data['teams']
        }
        ,
        (error: any) => console.log(error)
      )
  }

  fetchTeamMembers() {
    let body: any = {
      team_id: this.selectedTeam
    }
    this.teamService.getUsers(body).subscribe(
      (data: any) => this.teamMembers = data['users'],
      (error: any) => console.log(error)
    )
  }

  fetchBeats() {
    let httpParams = new HttpParams()
    if(this.selectedTeamMember) httpParams = httpParams.append('assignee_id', this.selectedTeamMember)
    httpParams = httpParams.append('date', String(this.dateUtils.getStandardizedDateFormate(this.selectedDate)))
    this.taskService.getDailyBeats(httpParams).subscribe(
      (data: any) => {
        this.savedBeats = data['beats']
      }
    )
  }

  assignBeat() {
    this.matDialog.open(AssignBeatComponent, {data: {team_id: this.selectedTeam, user_id: this.selectedTeamMember }})
  }

  openAssignedBeats(beat: beat) {
    if (beat.team_type.toLowerCase() == 'marketing'){
      this.router.navigate(['./manager/task/view-visits', beat.beat_id])
    } else if (beat.team_type.toLowerCase() == 'sales') {
      this.router.navigate(['./manager/task/view-tasks', beat.beat_id])
    }
  }
}
