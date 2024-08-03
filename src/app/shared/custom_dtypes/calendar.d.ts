export type addHoliday = {
    organization_id: number,
    name: string,
    date: string
}

export type editHoliday = {
    holiday_list_id: number,
    name: string,
    date: string
}

export type deleteHoliday = {
    holiday_list_id: number
}