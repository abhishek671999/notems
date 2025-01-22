export type addItem = {
    item_name: string,
    price: number,
    organization_id: number,
    category_id: number
}

export type editItem = {
    item_id: number,
    item_name: string,
    price: number,
    stock: number
    category_id?: number
}

export type deleteItem = {
    item_id: number
}

export type distributorStock = {
    "team_id": number,
    "team_name": string,
    "stock": number,
    is_edit: boolean
}

export type item = {
    item_id: number,
    item_name: string,
    price: number,
    stock: number,
    category_id?: number,
    category_name?: string,
    is_edit?: boolean,
    quantity?: number,
    line_item_id?: number,
    distributors_stock: distributorStock[]
}

export type updateTeamItem = {
    team_id: number,
    item_id: number,
    new_stock: number
}

export type getInventoryStockEndpoint = {
    offset?: number,
    count?: number,
    organization_id: number,
    team_id?: number,
    date?: string,
    item_id: number
}