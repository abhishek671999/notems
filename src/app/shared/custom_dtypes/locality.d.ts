export type addLocality = {
    "locality_name": string,
    "organization_id": number
}

export type editLocality = {
    "locality_id": number,
    "locality_name": string
}

export type deleteLocality = {
    "locality_id": number
}

export type locality = {
    "locality_id": number,
    "locality_name": string,
    "is_edit": boolean
}