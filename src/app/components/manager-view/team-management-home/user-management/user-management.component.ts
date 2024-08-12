import { Component } from '@angular/core';
import { TeamManagementService } from '../../../../shared/services/team-management/team-management.service';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Params } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddUserToTeamComponent } from '../../dialog-box/add-user-to-team/add-user-to-team.component';
import { removeUserFromTeam, users } from '../../../../shared/custom_dtypes/users';
import { ConfirmationBoxComponent } from '../../../shared/dialog-box/confirmation-box/confirmation-box.component';
import { SuccessMsgComponent } from '../../../shared/dialog-box/success-msg/success-msg.component';
import { ErrorMsgComponent } from '../../../shared/dialog-box/error-msg/error-msg.component';
import { team } from '../../../../shared/custom_dtypes/team';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent {

  constructor(
    private teamManagementService: TeamManagementService,
    private route: ActivatedRoute,
    private matdialog: MatDialog
  ) { }

  private teamId: number = 0
  public teamInfo: any;
  public teamMembersDataSource: users[] = []
  public teamMemberDataSourceColumns: string[] = ['sl_no', 'user_identity', 'role_name', 'delete']


  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
      this.teamId = params['team_id']
      
      let httpParams = new HttpParams()
      httpParams = httpParams.append('team_id', this.teamId)
      this.teamManagementService.getUsers(httpParams).subscribe(
        (data: any) => {
          this.teamMembersDataSource = data['users']
        },
        (error: any) => alert('Failed to fetch users')
      )

      this.teamManagementService.getMyTeams(httpParams).subscribe(
        (data: any) => this.teamInfo = data['teams'][0],
        (error: any) => alert('Failed to fetch teams')
      )
    })
  }

  deleteUser(user: any) {
    let dialogRef = this.matdialog.open(ConfirmationBoxComponent, { data: { msg: 'Are you sure want to remove user from team?' } })
    dialogRef.afterClosed().subscribe(
      (data: any) => {
        if (data.result) {
          let body: removeUserFromTeam = {
            team_id: this.teamId,
            user_id: user.user_id
          }
          this.teamManagementService.removeUserFromTeam(body).subscribe(
            (data: any) => {
              this.matdialog.open(SuccessMsgComponent, { data: { msg: 'Successfully removed user' } })
              this.ngOnInit()
            },
            (error: any) => this.matdialog.open(ErrorMsgComponent, {data: {msg: 'Failed to remove user'}})
          )
        }
      }
    )
  }

  addUsertoTeam() {
    let dialogRef = this.matdialog.open(AddUserToTeamComponent, { data: { teamId: this.teamId } })
    dialogRef.afterClosed().subscribe(
      (data: any) => this.ngOnInit()
    )
  }

}
