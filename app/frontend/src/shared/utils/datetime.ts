import type { CreationContextState } from "../../state/creation_context/state"
import { date2str_auto } from "./date_helpers"



export type TimeResolution = "second" | "minute" | "hour" | "day"



export function floor_mseconds_to_resolution (ms: number, time_resolution: TimeResolution): number
{
    const date = floor_datetime_to_resolution(new Date(ms), time_resolution)

    return date.getTime()
}



export function floor_datetime_to_resolution (date: Date, time_resolution: TimeResolution)
{
    const str = date2str_auto({ date, time_resolution })

    return new Date(str)
}



interface GetCreatedAtsReturn
{
    created_at: Date
    custom_created_at: Date | undefined
}
export function get_new_created_ats (creation_context_state?: CreationContextState): GetCreatedAtsReturn
{
    const created_at = new Date()
    let custom_created_at: Date | undefined = undefined
    if (creation_context_state)
    {
        const { use_creation_context, creation_context: cc } = creation_context_state
        custom_created_at = use_creation_context ? (cc && cc.custom_created_at) : undefined
    }

    return { created_at, custom_created_at }
}
