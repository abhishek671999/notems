import { Component, Inject } from '@angular/core';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { TeamManagementService } from '../../../../shared/services/team-management/team-management.service';
import { CustomersService } from '../../../../shared/services/customer/customers.service';
import { sessionWrapper } from '../../../../shared/site-variables';
import { dateUtils } from '../../../../shared/utils/date_utils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { team } from '../../../../shared/custom_dtypes/team';
import { customer } from '../../../../shared/custom_dtypes/customers';
import { HttpParams } from '@angular/common/http';
import { editBeat } from '../../../../shared/custom_dtypes/tasks';
import { SuccessMsgComponent } from '../../../shared/dialog-box/success-msg/success-msg.component';
import { ErrorMsgComponent } from '../../../shared/dialog-box/error-msg/error-msg.component';

@Component({
  selector: 'app-edit-beat',
  templateUrl: './edit-beat.component.html',
  styleUrl: './edit-beat.component.css'
})
export class EditBeatComponent {
  constructor(
    private tasksService: TaskManagementService,
    private teamService: TeamManagementService,
    private customerService: CustomersService,
    private sessionWrapper: sessionWrapper,
    private dateUtils: dateUtils,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private matdialogRef: MatDialogRef<EditBeatComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    console.log(data)
    this.editBeatForm = this.formBuilder.group({
      "team_id": [data.team_id, [Validators.required]],
      "customer_list": [data.customer_list, [Validators.required]],
      "title": [data.title, [Validators.required]],
      "note": [data.note, Validators.required],
      "description": [data.description, [Validators.required]]
    })
  }

  public editBeatForm: FormGroup;
  public teams: team[] = [];
  public customerList: customer[] = []

  ngOnInit() {
    let httpParams = new HttpParams()
    this.teamService.getMyTeams(httpParams).subscribe(
      (data: any) => {
       this.teams = data['teams']
      }
      ,
      (error: any) => console.log(error)
    )

    {
      let httpParams = new HttpParams()
      httpParams = httpParams.append('organization_id', Number(this.sessionWrapper.getItem('organization_id')))
      this.customerService.getCustomer(httpParams).subscribe(
        (data: any) => this.customerList = data['customers'],
        (error: any) => alert('Failed to get customer list')
      )
    }
  }

  addBeatCall() {
    let body: editBeat = {
      team_id: this.editBeatForm.value.team_id,
      customer_list: this.editBeatForm.value.customer_list,
      title: this.editBeatForm.value.title,
      note: this.editBeatForm.value.note,
      description: this.editBeatForm.value.description,
      beat_id: this.data.beat_id,
      assignee_id: 0,
      date: ''
    }
    this.tasksService.editBeat(body).subscribe(
      (data: any) => {
        this.matDialog.open(SuccessMsgComponent, { data: { msg: 'Beat edited successfully' } })
        this.matdialogRef.close({result: true})
      },
      (error: any) => {
        this.matDialog.open(ErrorMsgComponent, { data: { msg: 'Failed to add beat'}})
      }
    )
  }
}
