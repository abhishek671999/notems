export type appliedLeaves = {
    "leave_id": number,
    "from_date": string,
    "to_date": string,
    "half_day": boolean,
    "status": string,
    "approved_by": string,
    "reason": string,
    "type": string
}

export type updateLeaveStatus = {
    leave_id: number,
    new_status: nubmer
}