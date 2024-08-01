export type addBeat = {
    "team_id": number,
    "title": string,
    "note": string,
    "description": string
}

export type editBeat = {   
    "beat_id": number,
    "assignee_id": number,
    "date": string,
    "team_id": number,
    "title": string,
    "note": string,
    "description": string
}

export type deleteBeat = {
    beat_id: number
}

export type addTask = {
    "customer_id": number,
    "beat_id": number,
    "title": string,
    "note": string,
    "description": string,
    "location": string,
    "status": string
}

export type editTask = {   
    "task_id": number,
    "customer_id": number,
    "beat_id": number,
    "title": string,
    "note": string,
    "description": string,
    "location": string
}

export type deleteTask = {
    task_id: number
}

export type assignBeat = {
    "beat_id": number,
    "assignee_id": number,
    "date": string,
    "type": number,
    'days'?: number[]
}

export type unassignBeat = {
    "beat_id": number,
    "assignee_id": number,
    "date": string,
}