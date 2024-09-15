export type imageDetail = {
    "image_id": number,
    "image_url": string
}

export type lineItems = {
    "line_item_id": number,
    "item_id": number,
    "item_name": string,
    "quantity": number,
    "price": number,
    "unit_price": number,
    "category_id": number,
    "category_name": string
}

export type sale = {
    "type_id": number,
    "type_name": string,
    "customer": string,
    "customer_id":number,
    "total_amount": number,
    "discount": number,
    "received_amount": number,
    "image_details": image_detail[],
    "recorded_at": string,
    "recorded_by": string,
    "note": string,
    "beat_id": number,
    "organization_id": number,
    "invoice_number": string,
    "invoice_id": number,
    "line_items": lineItems[]
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
    date?: string | null
}