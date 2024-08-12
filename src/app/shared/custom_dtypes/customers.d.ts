export type deleteCustomer = {
    customer_id: number
}

export type editCustomer = {
    customer_id: number,
    type: number,
    outlet_name: string,
    contact_persons_details: string,
    note: string,
    gst_no: string,
    address: string,
    organization_id: number
}

export type addCustomer = {
    type: number,
    outlet_name: string,
    contact_persons_details: string,
    note: string,
    gst_no: string,
    address: string,
    organization_id: number
}

export type customer = {
    customer_name?: string,
    "customer_id": number,
    "type": string,
    "outlet_name": string,
    "gst_no": string | null,
    "contact_person": string,
    "note": string,
    "mobile": string,
    "email": string,
    "organization_id": number,
    "created_at": string,
    "created_by": string
}