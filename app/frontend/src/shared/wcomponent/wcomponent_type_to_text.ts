import type { WComponentType } from "./interfaces/wcomponent_base"



export function wcomponent_type_to_text (type: WComponentType)
{
    if (type === "counterfactual") return "counterfactualv1"
    if (type === "counterfactualv2") return "counterfactual"
    if (type === "state") return "statev1"
    if (type === "statev2") return "state"
    return type.replaceAll("_", " ")
}
