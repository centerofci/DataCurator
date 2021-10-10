import type { VAPSetIdToCounterfactualV2Map } from "../../../wcomponent/interfaces/counterfactual"
import type { RootState } from "../../State"
import { get_current_composed_knowledge_view_from_state } from "../accessors"



export function get_partial_args_for_get_counterfactual_v2_VAP_set (wcomponent_id: string, state: RootState)
{
    const current_composed_kv = get_current_composed_knowledge_view_from_state(state)

    let active_counterfactual_v2_ids: string[] | undefined = undefined
    let VAP_set_ids_to_counterfactuals_v2_map: VAPSetIdToCounterfactualV2Map | undefined = undefined
    if (current_composed_kv)
    {
        active_counterfactual_v2_ids = current_composed_kv.active_counterfactual_v2_ids

        const CFs_by_attribute = current_composed_kv.wc_id_counterfactuals_v2_map[wcomponent_id]
        VAP_set_ids_to_counterfactuals_v2_map = CFs_by_attribute?.VAP_sets // filter by active_counterfactual_v2_ids here?
    }

    return {
        active_counterfactual_v2_ids,
        VAP_set_ids_to_counterfactuals_v2_map,
    }
}
