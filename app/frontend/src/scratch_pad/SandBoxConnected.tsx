import { h, FunctionalComponent } from "preact"
import { useState } from "preact/hooks"
import { connect, ConnectedProps } from "react-redux"

import { AutocompleteText } from "../form/Autocomplete/AutocompleteText"
import { EditableText } from "../form/editable_text/EditableText"
import type { RootState } from "../state/State"
import "./SandBox.css"



const map_state = (state: RootState) =>
{
    return {}
}



const connector = connect(map_state)
type Props = ConnectedProps<typeof connector>



function _SandBoxConnected (props: Props)
{
    const [some_string, set_some_string] = useState("")

    return <div>
        <EditableText
            placeholder="..."
            value={some_string}
            conditional_on_blur={set_some_string}
        />
        <AutocompleteText
            selected_option_id={undefined}
            options={[]}
            allow_none={true}
            on_change={() => {}}
        />
    </div>
}

export const SandBoxConnected = connector(_SandBoxConnected) as FunctionalComponent<{}>
