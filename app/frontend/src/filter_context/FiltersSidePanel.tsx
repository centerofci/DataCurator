import { FunctionalComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import { MultiAutocompleteText } from "../form/Autocomplete/MultiAutocompleteText"
import { EditableCheckbox } from "../form/EditableCheckbox"
import { LabelsEditor } from "../labels/LabelsEditor"
import { wcomponent_types } from "../wcomponent/interfaces/wcomponent_base"
import { ACTIONS } from "../state/actions"
import type { RootState } from "../state/State"



const map_state = (state: RootState) => ({
    apply_filter: state.filter_context.apply_filter,
    filters: state.filter_context.filters,
})

const map_dispatch = {
    set_apply_filter: ACTIONS.filter_context.set_apply_filter,
    set_filters: ACTIONS.filter_context.set_filters,
}

const connector = connect(map_state, map_dispatch)
type Props = ConnectedProps<typeof connector>



function _FiltersSidePanel (props: Props)
{


    return <div>
        <h3>Filters</h3>

        <p>
            Enabled: <EditableCheckbox
                value={props.apply_filter}
                on_change={() => props.set_apply_filter(!props.apply_filter)}
            />
        </p>


        <p>
            Exclude by label:

            <LabelsEditor
                label_ids={props.filters.exclude_by_label_ids}
                on_change={exclude_by_label_ids =>
                {
                    props.set_filters({ filters: { ...props.filters, exclude_by_label_ids } })
                }}
                always_allow_editing={true}
            />
        </p>


        <p>
            Filter (include) by label:

            <LabelsEditor
                label_ids={props.filters.include_by_label_ids}
                on_change={include_by_label_ids =>
                {
                    props.set_filters({ filters: { ...props.filters, include_by_label_ids } })
                }}
                always_allow_editing={true}
            />
        </p>


        <p>
            Exclude by component type:

            <MultiAutocompleteText
                placeholder=""
                selected_option_ids={props.filters.exclude_by_component_types}
                options={wcomponent_type_options()}
                allow_none={true}
                on_change={exclude_by_component_types =>
                {
                    props.set_filters({ filters: { ...props.filters, exclude_by_component_types } })
                }}
                always_allow_editing={true}
            />
        </p>


        <p>
            Filter (include) by component type:

            <MultiAutocompleteText
                placeholder=""
                selected_option_ids={props.filters.include_by_component_types}
                options={wcomponent_type_options()}
                allow_none={true}
                on_change={include_by_component_types =>
                {
                    props.set_filters({ filters: { ...props.filters, include_by_component_types } })
                }}
                always_allow_editing={true}
            />
        </p>
    </div>
}

export const FiltersSidePanel = connector(_FiltersSidePanel) as FunctionalComponent<{}>



const wcomponent_type_options = () => wcomponent_types.map(type => ({ id: type, title: type }))
