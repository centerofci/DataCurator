import type { Dispatch } from "redux"

import { ACTIONS } from "../../actions"
import type { RootState } from "../../State"
import { needs_save } from "./needs_save"
import { storage_dependent_save } from "./save_state"



export function conditionally_save_state (load_state_from_storage: boolean, dispatch: Dispatch, state: RootState)
{
    const should_save = calc_should_save(load_state_from_storage, dispatch, state, true)
    if (!should_save) return

    storage_dependent_save(dispatch, state)
}



let allow_ctrl_s_to_flush_save = true
export async function conditional_ctrl_s_save (load_state_from_storage: boolean, dispatch: Dispatch, state: RootState)
{
    const should_save = calc_should_save(load_state_from_storage, dispatch, state, false)
    if (!should_save) return

    const ctrl_s_flush_save = is_ctrl_s_flush_save(state)
    if (ctrl_s_flush_save && allow_ctrl_s_to_flush_save)
    {
        allow_ctrl_s_to_flush_save = false

        await storage_dependent_save(dispatch, state)
        dispatch(ACTIONS.sync.set_next_sync_ms({ next_save_ms: undefined, data_type: "specialised_objects" }))
    }

    // Only reset it to true once `is_ctrl_s_flush_save` is no longer true
    // which should occur as soon as the ctrl or s key are released
    allow_ctrl_s_to_flush_save = !ctrl_s_flush_save
}


function is_ctrl_s_flush_save (state: RootState)
{
    // Ctrl+s to save
    return state.global_keys.keys_down.has("s") && state.global_keys.keys_down.has("Control")
}



function calc_should_save (load_state_from_storage: boolean, dispatch: Dispatch, state: RootState, cautious_save: boolean): boolean
{
    if (!load_state_from_storage) return false

    const { ready_for_writing, storage_type, specialised_objects } = state.sync
    if (!ready_for_writing) return false

    // Although the app is ready to save do not try to if it failed before
    if (cautious_save && specialised_objects.status === "FAILED") return false

    if (cautious_save && !needs_save(state)) return false

    if (!storage_type)
    {
        const error_message = "Can not save.  No storage_type set"
        dispatch(ACTIONS.sync.update_sync_status({
            status: "FAILED", data_type: "specialised_objects", error_message, attempt: 0,
        }))
        return false
    }

    return true
}
