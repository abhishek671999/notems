import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { host } from '../../site-variables';
import { addUserToTeam, removeUserFromTeam } from '../../custom_dtypes/users';


@Injectable({
  providedIn: 'root'
})
export class TeamManagementService {

  private getMyTeamsEndpoint = host + 'teams/get_my_teams/'
  private addUserToTeamEndpoint = host + 'teams/add_user_to_team/'
  private removeUserFromTeamEndpoint = host + 'teams/add_user_to_team/'
  private getUsersEndpoint = host + 'teams/get_users/'

  constructor(private httpClient: HttpClient) { }


  getUsers(body: any) {
    return this.httpClient.get(this.getUsersEndpoint, body)
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

}
