import { item } from "./items"

export type addBeat = {
    "team_id": number,
    locality_id: number,
    "title": string,
    "note": string,
    "description": string
}

export type editBeat = {   
    "beat_id": number,
    locality_id: number,
    "assignee_id": number,
    "date": string,
    "team_id": number,
    "title"?: string,
    "note": string,
    "description": string
}

export type deleteBeat = {
    beat_id: number
}

export type addTask = {
    "customer_id": number,
    "beat_id": number,
    "title"?: string,
    "note": string,
    "description": string,
    "location": string,
    "status": string
}

export type editTask = {   
    "task_id": number,
    "customer_id": number,
    "beat_id": number,
    "title"?: string,
    "note": string,
    "description": string,
    status: number
}

export type deleteTask = {
    task_id: number
}

export type assignBeat = {
    "beat_id": number,
    "assignee_id": number | null,
    "date"?: string,
    "type": number,
    'days'?: number[]
}

export type editAssignedBeat = {
    "beat_id": number,
    beat_assignee_id: number,       
    "assignee_id": number | null,
    "date"?: string,
    "type": number,
    'days'?: number[]
}

export type viewAssignedBeat = {
    "beat_id": number,
    beat_assignee_id: number,       
    "assignee_id": number,
    "team_id": number
    "date"?: string,
    "type": number,
    'days'?: number[]
}

export type unassignBeat = {
    "beat_id": number,
    "assignee_id": number,
    "date": string,
}

export type editSaleInvoiceHeader = {
    "invoice_id": number,
    "invoice_number": string,
    "customer_id": number,
    "discount": number,
    "received_amount": number,
    "note": string,
    "beat_id": number,
}

export type editSaleLineItems = {
    "line_item_id": number,
    "item_id": number,
    "price": number
}

export type updateSalesInvoiceLineItem = {
    "invoice_id": number,
    "item_details": item[]
}

export type deleteSaleInvoice = {   
    "invoice_id": number
}

export type deleteSaleInvoiceLineItem = {
    "line_item_id": number
}

export type getTasks = {
    customer_id?: number,
    type?: number,
    beat_id?: number,
    time_frame?: string,
    from_date?: string ,
    to_date?: string,
    added_by?: number,
    offset?: number,
    count?: number,
    date?: string | null
}



export type task = {
    "type_id": number,
    "type_name": string,
    "task_id": number,
    "beat_id": number,
    "customer": string,
    "added_by": string,
    "status": string,
    "created_at": string,
    "title": string,
    "description": string,
    "image_details": [],
    "note": string
}