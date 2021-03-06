import {
    WComponent,
    wcomponent_should_have_state_VAP_sets,
    wcomponent_is_statev2,
    wcomponent_is_action,
    wcomponent_is_causal_link,
    WComponentsById,
    wcomponent_is_state_value,
} from "./interfaces/SpecialisedObjects"
import type { WComponentStateV2SubType } from "./interfaces/state"
import { VAPsType } from "./interfaces/VAPsType"



export function get_wcomponent_VAPs_represent (wcomponent: WComponent | undefined, wcomponents_by_id: WComponentsById, _wcomponent_ids_touched: Set<string> = new Set()): VAPsType
{
    let VAPs_represent = VAPsType.undefined


    if (_wcomponent_ids_touched.has(wcomponent?.id || ""))
    {
        console. log(`Recursion prevented in "get_wcomponent_VAPs_represent" for wcomponent id: "${wcomponent?.id}" type: "${wcomponent?.type}"`)
        return VAPs_represent
    }
    if (wcomponent) _wcomponent_ids_touched.add(wcomponent.id)


    if (!wcomponent_should_have_state_VAP_sets(wcomponent)) return VAPs_represent


    VAPs_represent = VAPsType.other
    if (wcomponent_is_statev2(wcomponent)) VAPs_represent = subtype_to_VAPsType(wcomponent.subtype)
    else if (wcomponent_is_action(wcomponent)) VAPs_represent = VAPsType.action
    else if (wcomponent_is_causal_link(wcomponent))
    {
        // does this make sense? When is the VAPsType of a causal link used?
        VAPs_represent = VAPsType.boolean
    }
    else if (wcomponent_is_state_value(wcomponent))
    {
        const attribute_wcomponent = wcomponents_by_id[wcomponent.attribute_wcomponent_id || ""]
        if (attribute_wcomponent) VAPs_represent = get_wcomponent_VAPs_represent(attribute_wcomponent, wcomponents_by_id, _wcomponent_ids_touched)
    }
    else
    {
        console.error(`Unimplmented "get_wcomponent_VAPs_represent" for wcomponent id: "${wcomponent.id}" type: "${wcomponent.type}"`)
    }


    return VAPs_represent
}

function subtype_to_VAPsType (subtype: WComponentStateV2SubType | undefined): VAPsType
{
    return subtype === "boolean" ? VAPsType.boolean
    : (subtype === "number" ? VAPsType.number
        : (subtype === "other" ? VAPsType.other : VAPsType.undefined))
}
