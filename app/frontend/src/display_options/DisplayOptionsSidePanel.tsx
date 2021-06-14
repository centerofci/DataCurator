import { FunctionalComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import "./DisplayOptionsSidePanel.css"
import { AutocompleteText } from "../form/Autocomplete/AutocompleteText"
import { ACTIONS } from "../state/actions"
import type { ValidityFilterTypes, CertaintyFormattingTypes } from "../state/display_options/state"
import type { RootState } from "../state/State"
import { TimeResolutionOptions } from "./TimeResolutionOptions"



const map_state = (state: RootState) => ({
    validity_filter: state.display_options.validity_filter,
    certainty_formatting: state.display_options.certainty_formatting,
})


const map_dispatch = {
    set_validity_filter: ACTIONS.display.set_validity_filter,
    set_certainty_formatting: ACTIONS.display.set_certainty_formatting,
}


const connector = connect(map_state, map_dispatch)
type Props = ConnectedProps<typeof connector>



function _DisplayOptionsSidePanel (props: Props)
{

    return <div className="display_options_side_panel">
        <h3>Display Options</h3>



        <p className="section">
            <b>Validity filter</b>

            <br />

            <div style={{ display: "inline-flex" }}>
                Show: <AutocompleteText
                    placeholder=""
                    options={validity_filter_display_options}
                    selected_option_id={props.validity_filter}
                    allow_none={false}
                    on_change={validity_filter =>
                    {
                        if (!validity_filter) return
                        props.set_validity_filter({ validity_filter })
                    }}
                />
            </div>

            <br />

            <div className="description">
                Show only nodes and connections with validity <br/><i>
                certainty {validity_filter_descriptions[props.validity_filter]}</i> {description_of_certainty}.
            </div>
        </p>



        <p className="section">
            <b>Validity formatting</b>

            <br />

            <div style={{ display: "inline-flex" }}>
                Opacity: <AutocompleteText
                    placeholder=""
                    options={certainty_formatting_display_options}
                    selected_option_id={props.certainty_formatting}
                    allow_none={false}
                    on_change={certainty_formatting =>
                    {
                        if (!certainty_formatting) return

                        props.set_certainty_formatting({ certainty_formatting })
                    }}
                />
            </div>

            <br />

            <div className="description">
                Show nodes and connection opacity as <i>
                {certainty_formatting_descriptions[props.certainty_formatting]}</i> {description_of_certainty}.
            </div>
        </p>



        <p className="section">
            <b>Time resolution</b>

            <TimeResolutionOptions />
        </p>
    </div>
}

export const DisplayOptionsSidePanel = connector(_DisplayOptionsSidePanel) as FunctionalComponent<{}>



const description_of_certainty = "(certainty is the minimum of probability or confidence, e.g. something with 70% probability and 20% confidence is 20% certain)"



const validity_filter_display_options: { id: ValidityFilterTypes, title: string }[] = [
    { id: "only_certain_valid", title: "Only valid" },
    { id: "only_maybe_valid", title: "Only maybe Valid" },
    { id: "maybe_invalid", title: "Maybe Invalid" },
    { id: "show_invalid", title: "Invalid" },
]

const validity_filter_descriptions: { [type in ValidityFilterTypes]: string } = {
    only_certain_valid: "100%",
    only_maybe_valid: "> 50%",
    maybe_invalid: "> 0%",
    show_invalid: ">= 0%",
}



const certainty_formatting_display_options: { id: CertaintyFormattingTypes, title: string }[] = [
    { id: "render_certainty_as_opacity", title: "Use certainty" },
    { id: "render_certainty_as_easier_opacity", title: "Use certainty (opacity >= 50%)" },
    { id: "render_100_opacity", title: "Always 100%" },
]

const certainty_formatting_descriptions: { [type in CertaintyFormattingTypes]: string } = {
    render_certainty_as_opacity: "proportional to certainty",
    render_certainty_as_easier_opacity: "proportional to certainty but no lower than 50% (easier to see)",
    render_100_opacity: "always 100% (no transparency)",
}