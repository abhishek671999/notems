export type organization = {
    "organization_id": number,
    "organization_name": string,
    "role": string
}

export type team = {
    "team_id": number,
    "team_name": string,
    "role": string,
    "organization_id": number,
    "team_type": string
}