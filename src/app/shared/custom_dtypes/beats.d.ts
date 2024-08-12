import { customer } from "./customers"

export type beat = {
    "beat_id": number,
    "reporter": string,
    "created_at": string,
    "team_id": number,
    "team_type": string,
    "title": string,
    "description": string,
    "note": string,
    customers: customer[],
    assignee_id: number | null
}