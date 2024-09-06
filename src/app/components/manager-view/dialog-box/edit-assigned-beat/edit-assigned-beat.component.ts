import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { TeamManagementService } from '../../../../shared/services/team-management/team-management.service';
import { AssignBeatComponent } from '../assign-beat/assign-beat.component';
import { dateUtils } from '../../../../shared/utils/date_utils';
import { HttpParams } from '@angular/common/http';
import { beat } from '../../../../shared/custom_dtypes/beats';
import { assignBeat, editAssignedBeat, viewAssignedBeat } from '../../../../shared/custom_dtypes/tasks';
import { SuccessMsgComponent } from '../../../shared/dialog-box/success-msg/success-msg.component';
import { ErrorMsgComponent } from '../../../shared/dialog-box/error-msg/error-msg.component';
import { team } from '../../../../shared/custom_dtypes/team';

@Component({
  selector: 'app-edit-assigned-beat',
  templateUrl: './edit-assigned-beat.component.html',
  styleUrl: './edit-assigned-beat.component.css'
})
export class EditAssignedBeatComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: viewAssignedBeat,
    private taskManagementService: TaskManagementService,
    private teamService: TeamManagementService,
    private matdialog: MatDialog,
    private matdialogRef: MatDialogRef<AssignBeatComponent>,
    private dateUtils: dateUtils
  ) {
    console.log(data)
    this.selectedDate = data.date? new Date(data.date): null
    this.beatId = data.beat_id
    this.selectedTeam = data.team_id
    this.selectedType = data.type
    this.selectedDays = data.days ? data.days : []
    this.assigneeId = data.assignee_id
    this.beatAssigneeId = data.beat_assignee_id
  }

  private beatId: number
  public selectedDate: Date | null;
  public selectedType: number = 1
  public selectedTeam: any;
  public selectedTeamMember: any;
  public refreshWindow = false
  public assigneeId: number
  public beatAssigneeId: number

  public beatsSource: any = []
  public beatsSourceColumns = ['sl_no', 'title', 'reporter', 'assignee' ,'assign']

  public availableType = [
    { typeId: 3, typeName: 'Single day' },
    { typeId: 2, typeName: 'Daily' },
    { typeId: 1, typeName: 'Day wise'}
  ]

  public weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday', 'Sunday']
  public selectedDays: number[] = []

  public teams: any;
  public teamMembers: any = []

  ngOnInit() {
    this.fetchTeam()
    this.fetchBeats()
  }

  fetchBeats(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('team_id', this.selectedTeam)
    httpParams = httpParams.append('beat_id', this.beatId)
    this.taskManagementService.getBeats(httpParams).subscribe(
      (data: any) => {
        data['beats'].forEach((beat: beat) => {
          beat.assignee_id = this.assigneeId
        });
        this.beatsSource = data['beats']
      },
      (error: any) => alert('Failed to fetch beats')
    )
  }

  fetchTeamMembers() {
    let body: any = {
      team_id: this.selectedTeam
    }
    this.teamService.getUsers(body).subscribe(
      (data: any) => {
        this.teamMembers = data['users']
      },
      (error: any) => console.log(error)
    )
  }

  fetchTeam(){
    let httpParams = new HttpParams()
    this.teamService.getMyTeams(httpParams).subscribe(
      (data: any) => {
       this.teams = data['teams']
       this.fetchTeamMembers()
      }
      ,
      (error: any) => console.log(error)
    )
  }

  editBeat(beat: beat) {
    let body: editAssignedBeat = {
      beat_assignee_id: this.data.beat_assignee_id,
      beat_id: beat.beat_id,
      assignee_id: beat.assignee_id,
      type: this.selectedType,
    }
    if(this.selectedType == 3) body.date = String(this.dateUtils.getStandardizedDateFormate(this.selectedDate))
    if(this.selectedType == 1) body.days = this.selectedDays
    this.taskManagementService.editAssignBeat(body).subscribe(
      (data: any) => {
        this.matdialog.open(SuccessMsgComponent, {data: {msg: 'Assigned successfully'}})
        this.refreshWindow = true
      },
      (error: any) => {
        this.matdialog.open(ErrorMsgComponent, {data: {msg: error.error.description}})
      }
    )
  }

  assignBeatValidation(){
    return (this.selectedType == 1 && this.selectedDays.length > 0) || (this.selectedType == 3 && this.selectedDate) || this.selectedType == 2
  }

  closeDialog(){
    this.refreshWindow ? this.matdialogRef.close({result: true}): this.matdialogRef.close({result: false})
  }
}
