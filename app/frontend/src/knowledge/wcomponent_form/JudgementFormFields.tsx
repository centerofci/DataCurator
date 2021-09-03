import { FunctionalComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import { AutocompleteText } from "../../form/Autocomplete/AutocompleteText"
import type { AutocompleteOption } from "../../form/Autocomplete/interfaces"
import { EditableTextSingleLine } from "../../form/editable_text/EditableTextSingleLine"
import { sentence_case } from "../../shared/utils/sentence_case"
import { get_boolean_representation } from "../../shared/wcomponent/get_wcomponent_state_UI_value"
import { VAPsType } from "../../shared/wcomponent/interfaces/generic_value"
import {
    judgement_operators,
    WComponentJudgement,
} from "../../shared/wcomponent/interfaces/judgement"
import type { WComponent } from "../../shared/wcomponent/interfaces/SpecialisedObjects"
import { wcomponent_VAPs_represent } from "../../shared/wcomponent/value_and_prediction/utils"
import { get_wcomponent_counterfactuals } from "../../state/derived/accessor"
import { get_wcomponent_from_state } from "../../state/specialised_objects/accessors"
import type { RootState } from "../../state/State"
import { calculate_judgement_value } from "../judgements/calculate_judgement_value"
import { JudgementBadge } from "../judgements/JudgementBadge"
import { WComponentFromTo } from "../WComponentFromTo"



interface OwnProps
{
    wcomponent: WComponentJudgement
    upsert_wcomponent: (partial_wcomponent: Partial<WComponent>) => void
}


const map_state = (state: RootState, { wcomponent }: OwnProps) =>
{
    const target_id = wcomponent.judgement_target_wcomponent_id
    const target_wcomponent = get_wcomponent_from_state(state, target_id)
    const target_counterfactuals = get_wcomponent_counterfactuals(state, target_id)

    return {
        target_wcomponent,
        target_counterfactuals,
        created_at_ms: state.routing.args.created_at_ms,
        sim_ms: state.routing.args.sim_ms,
        is_editing: !state.display_options.consumption_formatting,
    }
}


const connector = connect(map_state)
type Props = ConnectedProps<typeof connector> & OwnProps



function _JudgementFormFields (props: Props)
{
    const { wcomponent, upsert_wcomponent, target_wcomponent, target_counterfactuals, created_at_ms, sim_ms } = props

    const { judgement_manual } = wcomponent
    const selected_option_id_for_manual = judgement_manual === undefined ? undefined : judgement_manual.toString()

    const judgement = calculate_judgement_value({ judgement_wcomponent: wcomponent, target_wcomponent, target_counterfactuals, created_at_ms, sim_ms })


    const target_VAPs_represent = wcomponent_VAPs_represent(target_wcomponent)
    let boolean_options: AutocompleteOption[] = []
    if (target_VAPs_represent === VAPsType.boolean)
    {
        const result = get_boolean_representation({ wcomponent: target_wcomponent, append_boolean: true })

        boolean_options = [
            { id: "True", title: result.true },
            { id: "False", title: result.false }
        ]
    }


    return <p>
        <WComponentFromTo
            connection_terminal_description="Target"
            wcomponent_id={target_wcomponent && target_wcomponent.id}
            connection_terminal_type="meta"
            on_update_id={judgement_target_wcomponent_id =>
            {
                const update: Partial<WComponentJudgement> = { judgement_target_wcomponent_id }

                if (!wcomponent.title && judgement_target_wcomponent_id)
                {
                    update.title = sentence_case(wcomponent.type) + `: @@${judgement_target_wcomponent_id}`
                }

                upsert_wcomponent(update)
            }}
        />

        <p>
            <div style={{ display: "inline-flex" }}>
                Comparator: &nbsp; <AutocompleteText
                    extra_styles={{ width: 30 }}
                    placeholder={"Operator..."}
                    selected_option_id={wcomponent.judgement_operator}
                    options={judgement_operator_options}
                    on_change={option_id => upsert_wcomponent({ judgement_operator: option_id })}
                    />
                &nbsp;

                {target_VAPs_represent !== VAPsType.boolean && <EditableTextSingleLine
                    placeholder="Value..."
                    value={wcomponent.judgement_comparator_value || ""}
                    conditional_on_change={new_value =>
                        {
                        const judgement_comparator_value = new_value.trim()

                        if (judgement_comparator_value === wcomponent.judgement_comparator_value) return
                        upsert_wcomponent({ judgement_comparator_value })
                    }}
                />}

                {target_VAPs_represent === VAPsType.boolean && <AutocompleteText
                    placeholder="Value..."
                    selected_option_id={wcomponent.judgement_comparator_value}
                    options={boolean_options}
                    on_change={judgement_comparator_value =>
                        {
                        if (!judgement_comparator_value) return

                        if (judgement_comparator_value === wcomponent.judgement_comparator_value) return
                        upsert_wcomponent({ judgement_comparator_value })
                    }}
                />}
            </div>
        </p>

        {(props.is_editing || selected_option_id_for_manual !== undefined) && <p>
            <div style={{ display: "inline-flex" }}>
                Manual: &nbsp; <AutocompleteText
                    placeholder={"Manual override..."}
                    allow_none={true}
                    selected_option_id={selected_option_id_for_manual}
                    options={manual_options}
                    on_change={option_id => {
                        const judgement_manual = option_id === undefined ? undefined : (option_id === "true" ? true : false)
                        upsert_wcomponent({ judgement_manual })
                    }}
                    />
            </div>
        </p>}

        <p>
            <div style={{ display: "inline-flex" }}>
                Current value: &nbsp; <JudgementBadge judgement={judgement} />
            </div>
        </p>
    </p>
}

export const JudgementFormFields = connector(_JudgementFormFields) as FunctionalComponent<OwnProps>


const judgement_operator_options = judgement_operators.map(op => ({ id: op, title: op }))
const manual_options = [{ id: "true", title: "Good" }, { id: "false", title: "Bad" }]
