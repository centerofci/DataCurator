import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js"

import type { WComponent } from "../../../shared/wcomponent/interfaces/SpecialisedObjects"
import type { SupabaseWComponent } from "../../../supabase/interfaces"
import { clean_base_object_of_sync_meta_fields } from "./clean_base_object_for_supabase"
import { supabase_create_item } from "./create_items"
import { supabase_get_items } from "./get_items"



const TABLE_NAME = "wcomponents"


type GetWComponentsArgs =
{
    supabase: SupabaseClient
} & ({
    base_id: number
    all_bases?: false
} | {
    base_id?: undefined
    all_bases: true
})
export function supabase_get_wcomponents (args: GetWComponentsArgs)
{
    return supabase_get_items<SupabaseWComponent, WComponent>({
        ...args,
        table: TABLE_NAME,
        converter: wcomponent_supabase_to_app,
    })
}



interface SupabaseUpsertWComponentArgs
{
    supabase: SupabaseClient
    wcomponent: WComponent
}
export async function supabase_upsert_wcomponent (args: SupabaseUpsertWComponentArgs)
{
    return args.wcomponent.modified_at ? supabase_update_wcomponent(args) : supabase_create_wcomponent(args)
}



async function supabase_create_wcomponent (args: SupabaseUpsertWComponentArgs)
{
    return supabase_create_item({
        supabase: args.supabase,
        table: TABLE_NAME,
        item: args.wcomponent,
        converter_app_to_supabase: wcomponent_app_to_supabase,
        converter_supabase_to_app: wcomponent_supabase_to_app,
    })
}



async function supabase_update_wcomponent (args: SupabaseUpsertWComponentArgs)
{
    const item = wcomponent_app_to_supabase(args.wcomponent)

    const result = await args.supabase.rpc("update_wcomponent", { item })


    let new_item: WComponent | undefined = undefined
    let error: PostgrestError | undefined | unknown = result.error || undefined
    try
    {
        let new_supabase_item: SupabaseWComponent = result.data as any
        if (result.status === 409) new_supabase_item = JSON.parse(result.error!.details)
        new_item = wcomponent_supabase_to_app(new_supabase_item)
    }
    catch (err)
    {
        console.error("Exception whilst handling rpc update_wcomponent response", err)
        error = err
    }


    return { status: result.status, error, item: new_item }
}



export function wcomponent_app_to_supabase (item: WComponent, base_id?: number): SupabaseWComponent
{
    base_id = item.base_id || base_id

    if (!base_id) throw new Error("Must provide base_id for wcomponent_app_to_supabase")

    const json = clean_base_object_of_sync_meta_fields(item)

    return {
        id: item.id,
        modified_at: item.modified_at ? item.modified_at.toISOString() : "",
        base_id,
        title: item.title,
        json,
    }
}



export function wcomponent_supabase_to_app (kv: SupabaseWComponent): WComponent
{
    let { json, id, base_id, modified_at } = kv
    // Ensure all the fields that are edited in the db are set correctly in the json data.
    // Do not update title.  This should only be edited by the client app.  The canonical
    // value is in the DB's json field not the title field.
    json = { ...json, id, base_id, modified_at: new Date(modified_at) }
    json = clean_base_object_of_sync_meta_fields(json) // defensive

    json.created_at = json.created_at && new Date(json.created_at)
    json.custom_created_at = json.custom_created_at && new Date(json.custom_created_at)
    json.modified_at = json.modified_at && new Date(json.modified_at)
    json.deleted_at = json.deleted_at && new Date(json.deleted_at)

    return json
}
