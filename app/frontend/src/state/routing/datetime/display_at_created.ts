import type { Action, AnyAction, Store } from "redux"

import { update_substate } from "../../../utils/update_state"
import type { RootState } from "../../State"
import type { RoutingStateArgs } from "../interfaces"
import { get_datetime_and_ms } from "./routing_datetime"



export const display_at_created_datetime_reducer = (state: RootState, action: AnyAction): RootState =>
{
    if (is_change_display_at_created_datetime(action))
    {
        const { ms, datetime } = get_datetime_and_ms(action)

        const args: RoutingStateArgs = {
            ...state.routing.args,
            created_at_datetime: datetime,
            created_at_ms: ms,
        }

        if (state.controls.linked_datetime_sliders)
        {
            args.sim_datetime = datetime
            args.sim_ms = ms
        }

        state = update_substate(state, "routing", "args", args)
    }

    return state
}


//
type UpdateCurrentDatetimeProps = { datetime: Date; ms?: undefined } | { ms: number; datetime?: undefined }
type ActionUpdateCurrentDatetime = Action & UpdateCurrentDatetimeProps

const change_display_at_created_datetime_type = "change_display_at_created_datetime"

const change_display_at_created_datetime = (args: UpdateCurrentDatetimeProps): ActionUpdateCurrentDatetime =>
{
    return { type: change_display_at_created_datetime_type, ...args }
}

const is_change_display_at_created_datetime = (action: AnyAction): action is ActionUpdateCurrentDatetime => {
    return action.type === change_display_at_created_datetime_type
}


export const display_at_created_datetime_actions = {
    change_display_at_created_datetime,
}


//

const one_hour = 3600 * 1000
export function periodically_change_display_at_created_datetime (store: Store<RootState>)
{
    setTimeout(() => {
        store.dispatch(change_display_at_created_datetime({ datetime: new Date() }))
    }, one_hour)
}
