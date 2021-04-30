import { make_graph, find_leaf_groups } from "../../utils/graph"
import { sort_list } from "../../utils/sort"
import type {
    StateValueAndPredictionsSet,
    VersionedStateVAPsSet,
    WComponentStateV2SubType,
    StateValueAndPrediction,
} from "../interfaces/state"
import { get_created_at_ms, get_sim_datetime } from "../utils_datetime"



const get_id = (vap_set: StateValueAndPredictionsSet) => `${vap_set.id}.${vap_set.version}`
const get_head_ids = (vap_set: StateValueAndPredictionsSet) => []
const get_tail_ids = (vap_set: StateValueAndPredictionsSet) =>
{
    return (vap_set.version > 1) ? [get_id({ ...vap_set, version: vap_set.version - 1 })] : []
}

export function group_vap_sets_by_version (vap_sets: StateValueAndPredictionsSet[]): VersionedStateVAPsSet[]
{
    const graph = make_graph({ items: vap_sets, get_id, get_head_ids, get_tail_ids })

    const groups = find_leaf_groups({ graph })
    const versioned: VersionedStateVAPsSet[] = groups.map(group =>
        {
            return {
                latest: group[0],
                older: group.slice(1),
            }
        })

    return versioned
}



export function sort_grouped_vap_sets (grouped_vap_sets: VersionedStateVAPsSet[]): VersionedStateVAPsSet[]
{
    const get_sort_key = (grouped_vap_set: VersionedStateVAPsSet) =>
    {
        return get_vap_datetime_sort_key(grouped_vap_set.latest)
    }

    return sort_list(grouped_vap_sets, get_sort_key, "descending")
}



export function ungroup_vap_sets_by_version (grouped_vap_sets: VersionedStateVAPsSet[]): StateValueAndPredictionsSet[]
{
    const vap_sets: StateValueAndPredictionsSet[] = []
    grouped_vap_sets.forEach(grouped_vap_set =>
    {
        vap_sets.push(grouped_vap_set.latest, ...grouped_vap_set.older)
    })
    return vap_sets
}



export function get_latest_versions_of_vap_sets (vap_sets: StateValueAndPredictionsSet[]): VersionedStateVAPsSet[]
{
    const graph = make_graph({ items: vap_sets, get_id, get_head_ids, get_tail_ids })

    const groups = find_leaf_groups({ graph })
    const versioned: VersionedStateVAPsSet[] = groups.map(group =>
        {
            return {
                latest: group[0],
                older: group.slice(1),
            }
        })

    return versioned
}


// // groups

// const latest_version_vaps = values_and_predictions.filter(vap => !vap.next_version_id)

// const ordered_latest_version_vaps = sort_list(latest_version_vaps, get_vap_datetime_sort_key, "descending")
//     .map(vap => [vap])


function get_vap_datetime_sort_key (vap: StateValueAndPredictionsSet)
{
    const dt = get_sim_datetime(vap)
    if (dt !== undefined) return dt.getTime()
    return get_created_at_ms(vap)
}



export function get_vaps_ordered_by_prob (vap_set: StateValueAndPredictionsSet, subtype: WComponentStateV2SubType): StateValueAndPrediction[]
{
    if (subtype === "boolean") return [vap_set.entries[0]]

    return vap_set.entries.filter(e => e.probability > 0)
        .sort((a, b) => a.probability > b.probability ? -1 : (a.probability < b.probability ? 1 : 0))
}