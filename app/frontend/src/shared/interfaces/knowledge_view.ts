import type { Base } from "./base"
import type { Project } from "../../wcomponent/interfaces/project"



export type KnowledgeViewSortType = "priority" | "normal" | "hidden" | "archived"
export const knowledge_view_sort_types: KnowledgeViewSortType[] = ["priority", "normal", "hidden", "archived"]


export interface DatetimeLineConfig
{
    time_origin_ms?: number
    time_origin_x?: number
    time_scale?: number
    time_line_number?: number
    time_line_spacing_days?: number
}

export interface KnowledgeView extends Base, Project, DatetimeLineConfig {
    // Explainable
    title: string
    description: string

    wc_id_map: KnowledgeViewWComponentIdEntryMap
    is_base?: true
    // Used for sharing data
    foundation_knowledge_view_ids?: string[]
    // Used for semantically organising knowledge views in relation to each other
    parent_knowledge_view_id?: string
    sort_type: KnowledgeViewSortType

    active_counterfactual_v2_ids?: string[]
}



export type KnowledgeViewsById = { [id: string]: KnowledgeView /*| undefined*/ }


export interface KnowledgeViewWComponentEntry {
    // TODO remove left and top and abstract over the upside down browser coordinate system by using x and y
    left: number
    top: number
    s?: number
    deleted?: true
}


export interface KnowledgeViewWComponentIdEntryMap {
    [world_component_id: string]: KnowledgeViewWComponentEntry
}
