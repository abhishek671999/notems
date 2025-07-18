import { item } from "./items"

export type addCategory = {
    category_name: string,
    organization_id: number
}

export type editCategory = {
    category_id: number,
    category_name: string
}

export type deleteCategory = {
    category_id: number
}

export type category = {
    category_id: number,
    category_name: string,
    items?: item[],
    is_edit?: boolean
}