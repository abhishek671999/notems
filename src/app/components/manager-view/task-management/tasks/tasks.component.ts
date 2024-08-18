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
import { ConfirmationBoxComponent } from '../../../shared/dialog-box/confirmation-box/confirmation-box.component';
import { unassignBeat } from '../../../../shared/custom_dtypes/tasks';
import { SuccessMsgComponent } from '../../../shared/dialog-box/success-msg/success-msg.component';
import { ErrorMsgComponent } from '../../../shared/dialog-box/error-msg/error-msg.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css', './../../../../app.component.css']
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
  public savedBeatsColumns = ['sl_no', 'title', 'reporter', 'reportee', 'description', 'note', 'create_date', 'unassign']

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
    if(this.selectedTeam) httpParams = httpParams.append('team_id', this.selectedTeam)
    httpParams = httpParams.append('date', String(this.dateUtils.getStandardizedDateFormate(this.selectedDate)))
    this.taskService.getDailyBeats(httpParams).subscribe(
      (data: any) => {
        this.savedBeats = data['beats']
      }
    )
  }

  assignBeat() {
    this.matDialog.open(AssignBeatComponent)
  }

  openAssignedBeats(beat: beat) {
    if (beat.team_type.toLowerCase() == 'marketing'){
      this.router.navigate(['./manager/task/view-visits', beat.beat_id])
    } else if (beat.team_type.toLowerCase() == 'sales') {
      this.router.navigate(['./manager/task/view-tasks', beat.beat_id])
    }
  }

  unassignBeat(beat: beat){
    let dialogRef = this.matDialog.open(ConfirmationBoxComponent, {data: {msg: 'Are you sure want to unassign this beat??'}})
    dialogRef.afterClosed().subscribe(
      (data: any) => {
        if(data.result){
          if(beat.assignee_id){
            let body: unassignBeat = {
              beat_id: beat.beat_id,
              assignee_id: beat.assignee_id,
              date: ''
            }
            this.taskService.unassignBeat(body).subscribe(
              (data: any) => {
                this.matDialog.open(SuccessMsgComponent, {data: {msg: 'Successfully unassigned'}})
                this.ngOnInit()
              },
              (error: any) => {
                this.matDialog.open(ErrorMsgComponent, {data: {msg: 'Failed to unassign beat'}})
              }
            )
          }
        }
      }
    )
  }
}
