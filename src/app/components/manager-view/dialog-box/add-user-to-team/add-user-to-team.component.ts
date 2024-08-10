import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TeamManagementService } from '../../../../shared/services/team-management/team-management.service';
import { HttpParams } from '@angular/common/http';
import { addUserToTeam, users } from '../../../../shared/custom_dtypes/users';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuccessMsgComponent } from '../../../shared/dialog-box/success-msg/success-msg.component';
import { ErrorMsgComponent } from '../../../shared/dialog-box/error-msg/error-msg.component';

@Component({
  selector: 'app-add-user-to-team',
  templateUrl: './add-user-to-team.component.html',
  styleUrl: './add-user-to-team.component.css'
})
export class AddUserToTeamComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private teamManagementService: TeamManagementService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private matDialogRef: MatDialogRef<AddUserToTeamComponent>
  ) { 
    this.addUserToTeamForm = this.formBuilder.group({
      user_id: ['', [Validators.required]],
      role_id: ['', [Validators.required]]
    })
  }

  public addUserToTeamForm: FormGroup;

  public allUsers: users[] = []
  public roles = [
    { roleId: 1, roleName: 'Manager' },
    { roleId: 2, roleName: 'Team member' }
  ]

  ngOnInit() {
    let httpParams = new HttpParams()
    this.teamManagementService.getUsers(httpParams).subscribe(
      (data: any) => {
        this.allUsers = data['users']
      },
      (error: any) => alert('Failed to fetch users')
      )
  }

  addUserToTeam() {
    let body: addUserToTeam = {
      user_id: this.addUserToTeamForm.value.user_id,
      role: this.addUserToTeamForm.value.role_id,
      team_id: Number(this.data.teamId)
    }
    this.teamManagementService.addUserToTeam(body).subscribe(
      (data: any) => {
        this.matDialog.open(SuccessMsgComponent, { data: { msg: 'User added to team' } })
        this.matDialogRef.close()
      },
      (error: any) => {
        this.matDialog.open(ErrorMsgComponent, {data: {msg: "Failed to add user to team"}})
      }
    )
  }


}
