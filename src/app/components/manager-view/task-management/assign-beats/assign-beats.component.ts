import { Component } from '@angular/core';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { TeamManagementService } from '../../../../shared/services/team-management/team-management.service';
import { MatDialog } from '@angular/material/dialog';
import { dateUtils } from '../../../../shared/utils/date_utils';
import { HttpParams } from '@angular/common/http';
import { beat } from '../../../../shared/custom_dtypes/beats';
import { SuccessMsgComponent } from '../../../shared/dialog-box/success-msg/success-msg.component';
import { assignBeat, unassignBeat, viewAssignedBeat } from '../../../../shared/custom_dtypes/tasks';
import { ErrorMsgComponent } from '../../../shared/dialog-box/error-msg/error-msg.component';
import { meAPIUtility } from '../../../../shared/site-variables';
import { AssignBeatComponent } from '../../dialog-box/assign-beat/assign-beat.component';
import { ConfirmationBoxComponent } from '../../../shared/dialog-box/confirmation-box/confirmation-box.component';
import { EditAssignedBeatComponent } from '../../dialog-box/edit-assigned-beat/edit-assigned-beat.component';

@Component({
  selector: 'app-assign-beats',
  templateUrl: './assign-beats.component.html',
  styleUrl: './assign-beats.component.css'
})
export class AssignBeatsComponent {
  constructor(
    private taskManagementService: TaskManagementService,
    private teamService: TeamManagementService,
    private matdialog: MatDialog,
    private dateUtils: dateUtils,
    private meUtility: meAPIUtility
  ) {

  }

  public selectedDate: Date | undefined;
  public selectedType: number = 1
  public selectedTeam: any;
  public selectedTeamMember: any;
  public organizationId!: number;

  public availableType = [
    { typeId: 3, typeName: 'Single day' },
    { typeId: 2, typeName: 'Weekly' },
    { typeId: 1, typeName: 'Day wise'}
  ]

  public weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday', 'Sunday']
  public selectedDays = []

  public teams: any;
  public teamMembers: any = []

  public assigneeBeats: any
  public assigneebeatsSource: assignBeat[] = []
  public beatsColumns = ['sl_no', 'team_type', 'assignee_name', 'frequency', 'edit' ,'unassign']

  ngOnInit() {
    this.meUtility.getOrganization().subscribe(
      (data: any) => {
      this.organizationId = data['organization_id']
      this.fetchBeatAssignees()
      }
  )
  }

  fetchBeatAssignees(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('organization_id', Number(this.organizationId))
    this.taskManagementService.getAssigneeBeats(httpParams).subscribe(
      (data: any) => {
        this.assigneebeatsSource = data['beat_assignees']
      },
      (error: any) => {
        alert('Failed to fetch beats')
      }
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

  fetchTeam(){
    let httpParams = new HttpParams()
    this.teamService.getMyTeams(httpParams).subscribe(
      (data: any) => {
       this.teams = data['teams']
      }
      ,
      (error: any) => console.log(error)
    )
  }

  assignBeat(beat: beat) {
    let body: assignBeat = {
      beat_id: beat.beat_id,
      assignee_id: beat.assignee_id,
      type: this.selectedType,
    }
    if(this.selectedType == 3) body.date = String(this.dateUtils.getStandardizedDateFormate(this.selectedDate))
    if(this.selectedType == 1) body.days = this.selectedDays
    this.taskManagementService.assignBeat(body).subscribe(
      (data: any) => {
        this.matdialog.open(SuccessMsgComponent, {data: {msg: 'Assigned successfully'}})
      },
      (error: any) => {
        this.matdialog.open(ErrorMsgComponent, {data: {msg: "Failed to assign"}})
      }
    )
  }

  assignBeatDialog() {
    let dialogRef = this.matdialog.open(AssignBeatComponent , { width: '85vw', maxWidth: '85vw'})
    dialogRef.afterClosed().subscribe(
      (data: any) => {
          this.ngOnInit()
      }
    )
  }

  openEditAssignedBeatDialog(assignBeat: viewAssignedBeat){
    let dialogRef = this.matdialog.open(EditAssignedBeatComponent, {data: assignBeat, width: '100vw', maxWidth: '85vw'})
    dialogRef.afterClosed().subscribe(
      (data: any) => {
          this.ngOnInit()
      }
    )
  }

  assignBeatValidation(){
    return (this.selectedType == 1 && this.selectedDays.length > 0) || (this.selectedType == 3 && this.selectedDate) || this.selectedType == 2
  }

  unassignBeat(beat: beat){
    let dialogRef = this.matdialog.open(ConfirmationBoxComponent, {data: {msg: 'Are you sure want to unassign this beat??'}})
    dialogRef.afterClosed().subscribe(
      (data: any) => {
        if(data.result){
          if(beat.assignee_id){
            let body: unassignBeat = {
              beat_id: beat.beat_id,
              assignee_id: beat.assignee_id,
              date: ''
            }
            this.taskManagementService.unassignBeat(body).subscribe(
              (data: any) => {
                this.matdialog.open(SuccessMsgComponent, {data: {msg: 'Successfully unassigned'}})
                this.ngOnInit()
              },
              (error: any) => {
                this.matdialog.open(ErrorMsgComponent, {data: {msg: 'Failed to unassign beat'}})
              }
            )
          }
        }
      }
    )
  }


}
