import { Component } from '@angular/core';
import { TeamManagementService } from '../../../../shared/services/team-management/team-management.service';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { addTeam, deleteTeam, editTeam } from '../../../../shared/custom_dtypes/users';
import { meAPIUtility } from '../../../../shared/site-variables';
import { MatDialog } from '@angular/material/dialog';
import { SuccessMsgComponent } from '../../../shared/dialog-box/success-msg/success-msg.component';
import { ErrorMsgComponent } from '../../../shared/dialog-box/error-msg/error-msg.component';
import { ConfirmationBoxComponent } from '../../../shared/dialog-box/confirmation-box/confirmation-box.component';
import { team } from '../../../../shared/custom_dtypes/team';

@Component({
  selector: 'app-team-management',
  templateUrl: './team-management.component.html',
  styleUrls: ['./team-management.component.css', './../../../../app.component.css'],
})
export class TeamManagementComponent {
  constructor(
    private matDialog: MatDialog,
    private teammanagementService: TeamManagementService,
    private router: Router,
    private meUtility: meAPIUtility
  ) { }

  public teamDataSource: any = []
  public teamDataSourceColumns: string[] = ['sl_no', 'team_name', 'department', 'is_distributor', 'edit', 'delete']

  public newTeam = ''
  public selectedDepartment = ''
  public departmentList = [
    { id: 2, name: 'Sales' },
    {id: 1, name: 'Marketing'}
  ]
  public isDistributor = true
  public organizationId!: number;

  ngOnInit() {
    this.meUtility.getOrganization().subscribe(
      (data: any) => {
      this.organizationId = data['organization_id']
      this.fetchMyTeam()
      }
    )
    
  }

  fetchMyTeam(){
    let httpParams = new HttpParams();
    this.teammanagementService.getMyTeams(httpParams).subscribe(
      (data: any) => {
        data['teams'].forEach((team: any) => {
          team.is_edit = false
        });
        this.teamDataSource = [...data['teams'], ...[{}]]

      },
      (error: any) => alert('Error while get my teams')
    )
  }

  addTeam() { 
    console.log(this.selectedDepartment, this.newTeam)
    let body: addTeam = {
      name: this.newTeam,
      type: Number(this.selectedDepartment),
      organization_id: Number(this.organizationId),
      is_distributors_team: this.isDistributor
    }
    this.teammanagementService.addTeam(body).subscribe(
      (data: any) => {
        this.matDialog.open(SuccessMsgComponent, { data: { msg: "Team added successfully" } })
        this.ngOnInit()
        this.newTeam = ''
        this.selectedDepartment = ''
      },
      (error: any) => this.matDialog.open(ErrorMsgComponent, {data: {msg: 'Failed to add team'}})
    )
  }
  
  editTeam(team: any, event: Event) {
    event.stopPropagation()
    team.is_edit = !team.is_edit
  }

  deleteTeam(team: any, event: Event) {
    event.stopPropagation()
    let dialogRef = this.matDialog.open(ConfirmationBoxComponent, { data: { msg: 'Are you sure want to delete this team?' } })
    dialogRef.afterClosed().subscribe(
      (data: any) => {
        if (data.result) {
          let body: deleteTeam = {
            team_id: team.team_id
          }
          this.teammanagementService.deleteTeam(body).subscribe(
            (data: any) => {
              this.matDialog.open(SuccessMsgComponent, { data: { msg: 'Team deleted successfully' } })
              this.ngOnInit()
            },
            (error: any) => {
              this.matDialog.open(ErrorMsgComponent, { data: {msg: 'Failed to delete team'}})
            }
          )
        }
      }
    )
  }
  
  submitEditTeam(team: team) {
    console.log(team)
    let body: editTeam = {
      name: team.team_name,
      type: team.type_id,
      team_id: team.team_id,
      is_distributors_team: team.is_distributors_team
    }
    this.teammanagementService.editTeam(body).subscribe(
      (data: any) => { 
        team.is_edit = !team.is_edit
        team.team_type = this.getTeamType(team.type_id)
      },
      (error: any) => {
        alert('Failed to edit')
      }
    )
  }

  redirectToUsers(team: any) {
    if (Object.keys(team).length > 0) this.router.navigate(['./manager/user-management', team.team_id])
  }

  getTeamType(id: number){
    return this.departmentList.filter((department: any) => department.id == id)[0].name
  }
}
