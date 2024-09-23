export interface leaveType{
    leave_type_id: number,
    leave_type_name: string,
    limit: number
}

export interface attendenceLocation{
    longitude: string,
    latitude: string
}

export interface addReimbursement{
    date: string,
    reimbursement_amount: string,
    reimbursement_reason: number
}