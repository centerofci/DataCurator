import { get_uncertain_datetime } from "../../shared/uncertainty/datetime"
import { get_created_at_ms } from "../../shared/utils_datetime/utils_datetime"
import type { ActionChangeRouteArgs } from "../../state/routing/actions"
import {
    update_value_possibilities_with_VAPSets,
} from "../../wcomponent/CRUD_helpers/update_possibilities_with_VAPSets"
import type { ValuePossibilitiesById } from "../../wcomponent/interfaces/possibility"
import type {
    StateValueAndPredictionsSet,
    HasVAPSetsAndMaybeValuePossibilities,
} from "../../wcomponent/interfaces/state"



interface HandleUpdateVAPSetsArgs
{
    existing_value_possibilities: ValuePossibilitiesById | undefined
    new_values_and_prediction_sets: StateValueAndPredictionsSet[]
    orig_values_and_prediction_sets: StateValueAndPredictionsSet[]
    current_created_at_ms: number
    sim_ms: number
    update_VAPSets_and_value_possibilities: (args: HasVAPSetsAndMaybeValuePossibilities) => void
    change_route: (routing_params: ActionChangeRouteArgs) => void
}
export function handle_update_VAP_sets (args: HandleUpdateVAPSetsArgs)
{
    const value_possibilities = update_value_possibilities_with_VAPSets(args.existing_value_possibilities, args.new_values_and_prediction_sets)
    args.update_VAPSets_and_value_possibilities({
        value_possibilities, values_and_prediction_sets: args.new_values_and_prediction_sets
    })

    const orig_latest_datetimes_ms = get_latest_VAP_set_datetimes_ms(args.orig_values_and_prediction_sets, args.current_created_at_ms)
    const new_latest_datetimes_ms = get_latest_VAP_set_datetimes_ms(args.new_values_and_prediction_sets, args.current_created_at_ms)

    const _1_minute = 1 * 60 * 1000
    const _10_minutes = 10 * _1_minute

    if (new_latest_datetimes_ms.latest_created_at_ms > orig_latest_datetimes_ms.latest_created_at_ms) {
        const created_at_ms = new_latest_datetimes_ms.latest_created_at_ms + _1_minute
        args.change_route({ args: { created_at_ms } })
    }

    // Move to current sim_ms so that when changing an action's status it updates appropriately
    const current_ms = new Date().getTime()
    const sim_ms = new_latest_datetimes_ms.latest_sim_ms
    const sim_ms_is_current = sim_ms < (current_ms + _1_minute) && sim_ms > (current_ms - _10_minutes)

    if (args.sim_ms < sim_ms && sim_ms_is_current) {
        args.change_route({ args: { sim_ms } })
    }
}



function get_latest_VAP_set_datetimes_ms (values_and_prediction_sets: StateValueAndPredictionsSet[], latest_created_at_ms = 0)
{
    let latest_sim_ms = Number.NEGATIVE_INFINITY

    values_and_prediction_sets.forEach(VAP_set =>
    {
        latest_created_at_ms = Math.max(get_created_at_ms(VAP_set), latest_created_at_ms)

        const sim_datetime = get_uncertain_datetime(VAP_set.datetime)
        if (sim_datetime) latest_sim_ms = Math.max(sim_datetime.getTime(), latest_sim_ms)
    })

    return { latest_created_at_ms, latest_sim_ms }
}