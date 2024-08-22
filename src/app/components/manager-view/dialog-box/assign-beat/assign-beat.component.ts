import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { HttpParams } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { assignBeat } from '../../../../shared/custom_dtypes/tasks';
import { SuccessMsgComponent } from '../../../shared/dialog-box/success-msg/success-msg.component';
import { ErrorMsgComponent } from '../../../shared/dialog-box/error-msg/error-msg.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TeamManagementService } from '../../../../shared/services/team-management/team-management.service';
import { beat } from '../../../../shared/custom_dtypes/beats';
import { dateUtils } from '../../../../shared/utils/date_utils';

@Component({
  selector: 'app-assign-beat',
  standalone: true,
  imports: [
    MatDialogModule, MatTableModule, MatButtonModule, ReactiveFormsModule, FormsModule,
    MatFormFieldModule, MatRadioModule, MatSelectModule, MatDatepickerModule, CommonModule,
    MatInputModule
  ],
  templateUrl: './assign-beat.component.html',
  styleUrl: './assign-beat.component.css'
})
export class AssignBeatComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taskManagementService: TaskManagementService,
    private teamService: TeamManagementService,
    private matdialog: MatDialog,
    private matdialogRef: MatDialogRef<AssignBeatComponent>,
    private dateUtils: dateUtils
  ) {

  }

  public selectedDate: Date | undefined;
  public selectedType: number = 1
  public selectedTeam: any;
  public selectedTeamMember: any;

  public beatsSource: any = []
  public beatsSourceColumns = ['sl_no', 'title', 'reporter', 'assignee' ,'assign']

  public availableType = [
    { typeId: 3, typeName: 'Single day' },
    { typeId: 2, typeName: 'Weekly' },
    { typeId: 1, typeName: 'Day wise'}
  ]

  public weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thrusday', 'Friday', 'Saturday', 'Sunday']
  public selectedDays = []

  public teams: any;
  public teamMembers: any = []

  ngOnInit() {
    this.fetchTeam()
  }

  fetchBeats(){
    let httpParams = new HttpParams()
    httpParams = httpParams.append('team_id', this.selectedTeam)
    this.taskManagementService.getBeats(httpParams).subscribe(
      (data: any) => {
        data['beats'].forEach((beat: beat) => {
          beat.assignee_id = null
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
        this.matdialogRef.close({result: true})
      },
      (error: any) => {
        this.matdialog.open(ErrorMsgComponent, {data: {msg: "Failed to assign"}})
      }
    )
  }

  assignBeatValidation(){
    return (this.selectedType == 1 && this.selectedDays.length > 0) || (this.selectedType == 3 && this.selectedDate)
  }


}
