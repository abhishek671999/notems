import { Component, Inject } from '@angular/core';
import { addBeat } from '../../../../shared/custom_dtypes/tasks';
import { TaskManagementService } from '../../../../shared/services/taskmanagement/task-management.service';
import { sessionWrapper } from '../../../../shared/site-variables';
import { dateUtils } from '../../../../shared/utils/date_utils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SuccessMsgComponent } from '../../../shared/dialog-box/success-msg/success-msg.component';
import { ErrorMsgComponent } from '../../../shared/dialog-box/error-msg/error-msg.component';

@Component({
  selector: 'app-add-beat',
  templateUrl: './add-beat.component.html',
  styleUrl: './add-beat.component.css'
})
export class AddBeatComponent {

  constructor(
    private tasksService: TaskManagementService,
    private sessionWrapper: sessionWrapper,
    private dateUtils: dateUtils,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.newBeat = this.formBuilder.group({
      "team_id": ['', [Validators.required]],
      "title": ['', [Validators.required]],
      "note": ['', Validators.required],
      "description": ['', [Validators.required]]
    })
  }
  
  public newBeat: FormGroup;

  addBeatCall() {
    let body: addBeat = {
      team_id: this.data.team_id,
      title: this.newBeat.value.title,
      note: this.newBeat.value.note,
      description: this.newBeat.value.description
    }
    this.tasksService.addBeat(body).subscribe(
      (data: any) => {
        this.matDialog.open(SuccessMsgComponent, {data: {msg: 'Beat added successfully'}})
      },
      (error: any) => {
        this.matDialog.open(ErrorMsgComponent, { data: { msg: 'Failed to add beat'}})
      }
    )
  }
}
