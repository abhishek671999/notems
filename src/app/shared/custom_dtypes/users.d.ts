export type addUserToTeam = {
    team_id: number,
    role: number
    user_id: number
}

export type removeUserFromTeam = {
    team_id: number,
    user_id: number
}

export type users = {
    user_id: number,
    email: string,
    mobile: string,
    first_name: string,
    last_name: string,
    user_identity: string
}

export type addTeam = {
    name: string,
    type: number,
    organization_id: number
}

export type deleteTeam = {
    team_id: number
}

export type editTeam = {
    name: string,
    type: number,
    team_id: number
}