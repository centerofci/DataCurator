import { FunctionalComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import { MultiAutocompleteText } from "../form/Autocomplete/MultiAutocompleteText"
import { is_defined } from "../shared/utils/is_defined"
import { get_title } from "../wcomponent_derived/rich_text/get_rich_text"
import { get_knowledge_view_from_state } from "../state/specialised_objects/accessors"
import { get_composed_wc_id_map, get_foundational_knowledge_views } from "../state/specialised_objects/knowledge_views/derived_reducer"
import type { RootState } from "../state/State"
import { useMemo } from "preact/hooks"



interface OwnProps
{
    knowledge_view_id: string
    on_change: (active_counterfactual_v2_ids: string[]) => void
}


const map_state = (state: RootState, own_props: OwnProps) =>
{
    const knowledge_view = get_knowledge_view_from_state(state, own_props.knowledge_view_id)
    const { wcomponents_by_id, knowledge_views_by_id } = state.specialised_objects

    return {
        knowledge_view,
        wcomponents_by_id,
        knowledge_views_by_id,
        editing: !state.display_options.consumption_formatting,
    }
}


const connector = connect(map_state)
type Props = ConnectedProps<typeof connector> & OwnProps



function _KnowledgeViewActiveCounterFactuals (props: Props)
{
    const { editing, knowledge_view, wcomponents_by_id, knowledge_views_by_id, on_change } = props

    if (!knowledge_view) return <div></div>


    const selected_option_ids = knowledge_view.active_counterfactual_v2_ids || []

    const foundational_knowledge_views = get_foundational_knowledge_views(knowledge_view, knowledge_views_by_id)
    const options = useMemo(() =>
    {
        const wc_id_map = get_composed_wc_id_map(foundational_knowledge_views)

        const options = Object.keys(wc_id_map)
            .map(id => wcomponents_by_id[id])
            .filter(is_defined)
            .filter(({ type }) => type === "counterfactualv2")
            .map(wcomponent => ({
                id: wcomponent.id,
                title: get_title({
                    wcomponent,
                    rich_text: true,
                    render_links: false,
                    wcomponents_by_id,
                    wc_id_to_counterfactuals_map: {},
                    created_at_ms: FUTURE_TIME_MS,
                    sim_ms: FUTURE_TIME_MS,
                }),
            }))

        return options
    }, [wcomponents_by_id, ...foundational_knowledge_views])


    if (editing)
    {
        if (options.length === 0) return <div>
            No counterfactuals in composed knowledge view (includes foundational knowledge views)
        </div>
    }
    else
    {
        if (selected_option_ids.length === 0) return <div>No assumptions set</div>
    }


    return <div>
        <MultiAutocompleteText
            placeholder="..."
            allow_none={true}
            selected_option_ids={selected_option_ids}
            options={options}
            on_change={on_change}
        />
    </div>
}

export const KnowledgeViewActiveCounterFactuals = connector(_KnowledgeViewActiveCounterFactuals) as FunctionalComponent<OwnProps>



const FUTURE_TIME_MS = new Date().getTime() + 1e11
