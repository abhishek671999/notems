export type deleteCustomer = {
    customer_id: number
}

export type editCustomer = {
    customer_id: number,
    type: number,
    customer_name: string,
    contact_persons_details: string,
    note: string,
    gst_no: string,
    address: string,
    locality_id: number,
    organization_id: number
}

export type addCustomer = {
    type: number,
    customer_name: string,
    contact_persons_details: string,
    locality_id: number,
    note: string,
    gst_no: string,
    address: string,
    organization_id: number
}

export type customer = {
    customer_name?: string,
    pending_amount: number,
    "customer_id": number,
    "type": string,
    "customer_name": string,
    "gst_no": string | null,
    "contact_person": string,
    "note": string,
    "mobile": string,
    "email": string,
    "organization_id": number,
    "created_at": string,
    "created_by": string
}

export type payCustomerPendingAmount = {
    "customer_id": number,
    "paid_amount" : number
}