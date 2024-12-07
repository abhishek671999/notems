export type team = {
    team_id: number,
    team_name: string,
    team_organization_id: number,
    team_type: string,
    type_id: number
    is_edit?: boolean,
    is_distributors_team: boolean
}

export type teamMember = {
    "user_id": number,
    "email": string,
    "mobile": string,
    "first_name": string,
    "last_name": string,
    "user_identity": string
}