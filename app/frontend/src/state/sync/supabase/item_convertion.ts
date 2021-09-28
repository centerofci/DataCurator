import type { Base } from "../../../shared/interfaces/base"
import type { SupabaseReadItem, SupabaseWriteItem } from "../../../supabase/interfaces"
import { clean_base_object_of_sync_meta_fields } from "./clean_base_object_for_supabase"



export function app_item_to_supabase <U extends Base & { title: string }> (item: U, base_id?: number): SupabaseWriteItem<U>
{
    base_id = item.base_id || base_id

    if (!base_id) throw new Error("Must provide base_id for app_item_to_supabase")

    const json = clean_base_object_of_sync_meta_fields(item)

    return {
        id: item.id,
        modified_at: (item.modified_at ? item.modified_at.toISOString() : undefined) as any,
        base_id,
        title: item.title,
        json,
    }
}



export function supabase_item_to_app <U extends Base> (item: SupabaseReadItem<U>): U
{
    let { json, id, base_id, modified_at } = item
    // Append `Z` for datetime value from server as it does not get stored with timezone and javascript's local
    // Date will parse it incorrectly.
    const modified_at_date = modified_at ? new Date(modified_at + "Z") : undefined
    // Ensure all the fields that are edited in the db are set correctly in the json data.
    // Do not update title.  This should only be edited by the client app.  The canonical
    // value is in the DB's json field not the title field.
    json = { ...json, id, base_id, modified_at: modified_at_date }
    json = clean_base_object_of_sync_meta_fields(json) // defensive

    json.created_at = json.created_at && new Date(json.created_at)
    json.custom_created_at = json.custom_created_at && new Date(json.custom_created_at)
    json.deleted_at = json.deleted_at && new Date(json.deleted_at)

    return json
}