import { Component } from '@angular/core';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { HttpParams } from '@angular/common/http';
import { sessionWrapper } from '../../../../shared/site-variables';
import { dateUtils } from '../../../../shared/utils/date_utils';
import { addBeat } from '../../../../shared/custom_dtypes/tasks';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SuccessMsgComponent } from '../../../shared/dialog-box/success-msg/success-msg.component';
import { ErrorMsgComponent } from '../../../shared/dialog-box/error-msg/error-msg.component';
import { AddBeatComponent } from '../../dialog-box/add-beat/add-beat.component';
import { TeamManagementService } from '../../../../shared/services/team-management/team-management.service';
import { DataSource } from '@angular/cdk/collections';
import { Router } from '@angular/router';

@Component({
  selector: 'app-beats',
  templateUrl: './beats.component.html',
  styleUrl: './beats.component.css'
})
export class BeatsComponent {

  constructor(
    private tasksService: TaskManagementService,
    private teamService: TeamManagementService,
    private sessionWrapper: sessionWrapper,
    private dateUtils: dateUtils,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private router: Router
  ) { 
    this.newBeat = this.formBuilder.group({
      "team_id": ['', [Validators.required]],
      "title": ['', [Validators.required]],
      "note": ['', Validators.required],
      "description": ['', [Validators.required]]
    })
  }

  public newBeat: FormGroup;
  public selectedTeam: any;
  public teams: any;
  public savedBeats: any = [];
  public savedBeatsColumns = ['sl_no', 'title', 'reporter', 'team_name', 'description', 'note', 'create_date']

  ngOnInit() {
    {
      let httpParams = new HttpParams()
      httpParams = httpParams.append('type', 2) // hardcode
      this.teamService.getMyTeams(httpParams).subscribe(
        (data: any) => {
         this.teams = data['teams']
        }
        ,
        (error: any) => console.log(error)
      )
    }
    {
      let httpParams = new HttpParams()
      if(this.selectedTeam) httpParams = httpParams.append('team_id', this.selectedTeam)
      this.tasksService.getBeats(httpParams).subscribe(
        (data: any) => {
          this.savedBeats = data['beats']
        },
        (error: any) => alert(error)
      )
    }

  }

  addBeat() {
    this.matDialog.open(AddBeatComponent, { data: {team_id: this.selectedTeam} })
  }

  openTasks(beat: any) {
    console.log(beat)
    if (beat.type) {
      this.router.navigate(['./manager/task/view-visits', beat.beat_id])
    } else {
      this.router.navigate(['./manager/task/view-tasks', beat.beat_id])
    }
    
  }

  

}
