export type addItem = {
    item_name: string,
    price: number,
    organization_id: number,
    category_id: number
}

export type editItem = {
    item_id: number,
    item_name: string,
    price: number
}

export type deleteItem = {
    item_id: number
}


export type item = {
    item_id: number,
    item_name: string,
    price: number,
    is_edit?: boolean,
    quantity?: number
}