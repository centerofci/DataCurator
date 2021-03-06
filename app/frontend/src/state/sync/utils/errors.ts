import type { PostgrestError } from "@supabase/supabase-js"



export interface SyncError
{
    type: "insufficient_information" | "loading_error" | "general"
    message?: string
}



// TODO merge with DisplaySupabaseSessionError and DisplaySupabasePostgrestError
export function error_to_string (error: Partial<PostgrestError> | SyncError | Error | undefined)
{
    if (error)
    {
        if (("type" in error) && typeof error.type === "string")
        {
            return error.type + ": " + (error.message || "<no message>")
        }
        else if (`${error}`.includes("[object"))
        {
            return JSON.stringify(error)
        }
    }

    return `${error}`
}
