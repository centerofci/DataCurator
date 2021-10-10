import type { Action, AnyAction } from "redux"

import type { CanvasPoint } from "../../../canvas/interfaces"
import type { WComponent } from "../../../wcomponent/interfaces/SpecialisedObjects"
import { bulk_editing_wcomponents_actions } from "./bulk_edit/actions"



export interface AddToKnowledgeViewArgs
{
    id: string
    position: CanvasPoint
}

interface UpsertWComponentArgs
{
    wcomponent: WComponent
    source_of_truth?: boolean
    add_to_knowledge_view?: AddToKnowledgeViewArgs
}
interface ActionUpsertWComponent extends Action, UpsertWComponentArgs {}

const upsert_wcomponent_type = "upsert_wcomponent"

const upsert_wcomponent = (args: UpsertWComponentArgs): ActionUpsertWComponent =>
    ({ type: upsert_wcomponent_type, ...args })

export const is_upsert_wcomponent = (action: AnyAction): action is ActionUpsertWComponent => {
    return action.type === upsert_wcomponent_type
}



interface DeleteWComponentArgs
{
    wcomponent_id: string
}
interface ActionDeleteWComponent extends Action, DeleteWComponentArgs {}

const delete_wcomponent_type = "delete_wcomponent"

const delete_wcomponent = (args: DeleteWComponentArgs): ActionDeleteWComponent =>
    ({ type: delete_wcomponent_type, ...args })

export const is_delete_wcomponent = (action: AnyAction): action is ActionDeleteWComponent => {
    return action.type === delete_wcomponent_type
}



export const wcomponent_actions = {
    upsert_wcomponent,
    delete_wcomponent,
    ...bulk_editing_wcomponents_actions,
}
