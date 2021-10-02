import { FunctionalComponent, h } from "preact"

import type {
    StateValueAndPredictionsSet,
} from "../../shared/wcomponent/interfaces/state"
import type { RootState } from "../../state/State"
import { connect, ConnectedProps } from "react-redux"
import { ValueAndPredictionSetsComponent } from "./ValueAndPredictionSetsComponent"
import type { VAPsType } from "../../shared/wcomponent/interfaces/generic_value"
import { partition_and_prune_items_by_datetimes_and_versions } from "../../shared/wcomponent/value_and_prediction/utils"
import { selector_chosen_base_id } from "../../state/user_info/selector"



interface OwnProps
{
    wcomponent_id: string
    VAPs_represent: VAPsType
    values_and_prediction_sets: StateValueAndPredictionsSet[]
    update_values_and_predictions: (values_and_predictions: StateValueAndPredictionsSet[]) => void
}


const map_state = (state: RootState) =>
{
    return {
        created_at_ms: state.routing.args.created_at_ms,
        sim_ms: state.routing.args.sim_ms,
        creation_context: state.creation_context,
        editing: !state.display_options.consumption_formatting,
        base_id: selector_chosen_base_id(state),
    }
}



const connector = connect(map_state)
type Props = ConnectedProps<typeof connector> & OwnProps


function _ValueAndPredictionSets (props: Props)
{
    const {
        wcomponent_id, values_and_prediction_sets, VAPs_represent, base_id = -1,
    } = props

    const { invalid_future_items, past_items, present_items, future_items, previous_versions_by_id } = partition_and_prune_items_by_datetimes_and_versions({
        items: values_and_prediction_sets,
        created_at_ms: props.created_at_ms,
        sim_ms: props.sim_ms,
    })

    return <ValueAndPredictionSetsComponent
        wcomponent_id={wcomponent_id}

        item_descriptor="Value Prediction"
        VAPs_represent={VAPs_represent}
        update_items={props.update_values_and_predictions}

        values_and_prediction_sets={values_and_prediction_sets}
        invalid_future_items={invalid_future_items}
        past_items={past_items}
        present_items={present_items}
        future_items={future_items}
        previous_versions_by_id={previous_versions_by_id}

        base_id={base_id}
        creation_context={props.creation_context}
        editing={props.editing}
    />
}

export const ValueAndPredictionSets = connector(_ValueAndPredictionSets) as FunctionalComponent<OwnProps>
