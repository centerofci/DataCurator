import type { Dispatch } from "redux"

import {
    CoreObject,
    CoreObjectAttribute,
    is_id_attribute,
    ObjectAttribute,
    ObjectWithCache,
    RootState,
} from "../../State"
import { ACTIONS } from "../../actions"
import type { SpecialisedObjectsFromToServer } from "../../../shared/wcomponent/interfaces/SpecialisedObjects"
import { LOCAL_STORAGE_STATE_KEY } from "./supported_keys"
import { setItem } from "localforage"



let last_saved: RootState | undefined = undefined
export function save_state (dispatch: Dispatch, state: RootState)
{
    if (!needs_save(state, last_saved)) return

    last_saved = state
    dispatch(ACTIONS.sync.update_sync_status({ status: "SAVING" }))

    const specialised_state = get_specialised_state_to_save(state)

    let promise_save_data: Promise<any>

    if (state.sync.storage_type === "local_server")
    {
        // const state_to_save = get_state_to_save(state)
        // const state_str = JSON.stringify(state_to_save)

        // fetch("http://localhost:4000/api/v1/state/", {
        //     method: "post",
        //     body: state_str,
        // })

        const specialised_state_str = JSON.stringify(specialised_state)
        promise_save_data = fetch("http://localhost:4000/api/v1/specialised_state/", {
            method: "post",
            body: specialised_state_str,
        })
    }
    else
    {
        promise_save_data = setItem(LOCAL_STORAGE_STATE_KEY, specialised_state)
    }

    promise_save_data
    .then(() => dispatch(ACTIONS.sync.update_sync_status({ status: undefined })))
}


function needs_save (state: RootState, last_saved: RootState | undefined)
{
    return (!last_saved ||
        // state.statements !== last_saved.statements ||
        // state.patterns !== last_saved.patterns ||
        // state.objects !== last_saved.objects ||
        state.specialised_objects !== last_saved.specialised_objects
    )
}


// function get_state_to_save (state: RootState)
// {
//     const state_to_save = {
//         statements: state.statements,
//         patterns: state.patterns,
//         objects: state.objects.map(convert_object_to_core),
//     }
//     Object.keys(state).forEach(k => {
//         if (!supported_keys.includes(k as any)) throw new Error(`Unexpected key "${k}" in state to save`)
//     })

//     return state_to_save
// }


function convert_object_to_core (object: ObjectWithCache): CoreObject
{
    return {
        id: object.id,
        datetime_created: object.datetime_created,
        labels: object.labels,
        attributes: object.attributes.map(convert_attribute_to_core),
        pattern_id: object.pattern_id,
        external_ids: object.external_ids,
    }
}

function convert_attribute_to_core (attribute: ObjectAttribute): CoreObjectAttribute
{
    if (is_id_attribute(attribute))
    {
        return {
            pidx: attribute.pidx,
            id: attribute.id,
        }
    }

    return {
        pidx: attribute.pidx,
        value: attribute.value,
    }
}


function get_specialised_state_to_save (state: RootState)
{
    const specialised_state: SpecialisedObjectsFromToServer = {
        perceptions: state.derived.perceptions,
        wcomponents: state.derived.wcomponents,
        knowledge_views: state.derived.knowledge_views,
    }

    return specialised_state
}