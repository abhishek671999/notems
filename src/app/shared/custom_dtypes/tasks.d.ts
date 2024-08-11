import { item } from "./items"

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

export type editSaleInvoiceHeader = {
    "sale_invoice_id": number,
    "customer_id": number,
    "discount": number,
    "received_amount": number,
    "note": string,
    "beat_id": number,
}

export type updateSalesInvoiceLineItem = {
    "sale_invoice_id": number,
    "item_details": item[]
}

export type deleteSaleInvoice = {   
    "sale_invoice_id": number
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
}

export type getSales = {
    customer_id?: number,
    type?: number,
    beat_id?: number,
    time_frame?: string,
    from_date?: string ,
    to_date?: string,
    recorded_by?: number,
    offset?: number,
    count?: number,
}