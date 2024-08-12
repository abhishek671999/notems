import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { host } from '../../site-variables';
import { addTeam, addUserToTeam, deleteTeam, editTeam, removeUserFromTeam } from '../../custom_dtypes/users';


@Injectable({
  providedIn: 'root'
})
export class TeamManagementService {

  private getMyTeamsEndpoint = host + 'teams/get_my_teams/'
  private addUserToTeamEndpoint = host + 'teams/add_user_to_team/'
  private removeUserFromTeamEndpoint = host + 'teams/remove_user_from_team/'

  private getUsersEndpoint = host + 'teams/get_users/'
  private addTeamEndpoint = host + 'teams/add_team/'
  private deleteTeamEndpoint = host + 'teams/delete_team/'
  private editTeamEndpoint = host + 'teams/edit_team/'

  constructor(private httpClient: HttpClient) { }


  getUsers(params: HttpParams) {
    return this.httpClient.get(this.getUsersEndpoint, {params: params})
  }

  getMyTeams(httpParams: HttpParams) {
    return this.httpClient.get(this.getMyTeamsEndpoint, {params: httpParams})
  }

  addUserToTeam(body: addUserToTeam) {
    return this.httpClient.post(this.addUserToTeamEndpoint, body)
  }

  removeUserFromTeam(body: removeUserFromTeam) {
    return this.httpClient.post(this.removeUserFromTeamEndpoint, body)
  }

  addTeam(body: addTeam) {
    return this.httpClient.post(this.addTeamEndpoint, body)
  }

  deleteTeam(body: deleteTeam) {
    return this.httpClient.delete(this.deleteTeamEndpoint, {body})
  }

  editTeam(body: editTeam) {
    return this.httpClient.post(this.editTeamEndpoint, body)
  }

}
