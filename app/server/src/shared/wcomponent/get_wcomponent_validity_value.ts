import { WComponent, wcomponent_has_validity_predictions } from "./interfaces/SpecialisedObjects"
import type { CurrentValue } from "./interfaces/generic_value"
import { partition_and_prune_items_by_datetimes } from "./utils_datetime"
import { calc_is_uncertain } from "./uncertainty_utils"



export interface CurrentValidityValue extends CurrentValue
{
    value: boolean
}


const default_value = (): CurrentValidityValue => ({
    possibilities: [],
    is_defined: false,
    value: true,
    probability: 1,
    conviction: 1,
    certainty: 1,
    uncertain: false,
    assumed: false,
})


interface GetWcomponentStateValueArgs
{
    wcomponent: WComponent
    created_at_ms: number
    sim_ms: number
}
export function get_wcomponent_validity_value (args: GetWcomponentStateValueArgs): CurrentValidityValue
{
    const { wcomponent, created_at_ms, sim_ms } = args

    if (!wcomponent_has_validity_predictions(wcomponent)) return default_value()

    // TODO upgrade validities from simple predictions to VAP_sets
    // get_VAP_set_possible_values({
    //     values_and_prediction_sets: wcomponent.validity,
    //     VAPs_represent,
    //     wc_counterfactuals,
    //     created_at_ms,
    //     sim_ms,
    // })

    // .values are sorted created_at ascending
    const active_validity = partition_and_prune_items_by_datetimes({ items: wcomponent.validity, created_at_ms, sim_ms }).present_items.last()

    if (!active_validity) return default_value()

    const { probability, conviction } = active_validity
    const valid = probability > 0.5
    const uncertain = calc_is_uncertain({ probability, conviction })
    const certainty = Math.min(probability, conviction)

    return {
        possibilities: [], // TODO this will get values once we're using VAPs
        is_defined: true,
        value: valid,
        uncertain,
        probability,
        conviction,
        certainty,
        assumed: false,
    }
}
