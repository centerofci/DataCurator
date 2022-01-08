import Markdown from "markdown-to-jsx"
import { FunctionalComponent, h } from "preact"
import { useEffect, useState } from "preact/hooks"
import { connect, ConnectedProps } from "react-redux"
import { Button } from "../sharedf/Button"
import { Link } from "../sharedf/Link"

import { ACTIONS } from "../state/actions"
import type { RootState } from "../state/State"
import { WComponent, wcomponent_is_judgement_or_objective, wcomponent_is_plain_connection } from "../wcomponent/interfaces/SpecialisedObjects"
import { get_title } from "../wcomponent_derived/rich_text/get_rich_text"



interface OwnProps
{
    wcomponent_id: string
}

const map_state = (state: RootState) =>
{
    return { wcomponents_by_id: state.specialised_objects.wcomponents_by_id }
}

const map_dispatch = {
    change_route: ACTIONS.routing.change_route,
}

const connector = connect(map_state, map_dispatch)
type Props = ConnectedProps<typeof connector> & OwnProps



function _WComponentBackReferences (props: Props)
{
    const { wcomponent_id, wcomponents_by_id } = props
    const [show_back_references, set_show_back_references] = useState(false)
    const [other_wcomponents, set_other_wcomponents] = useState<WComponent[]>([])

    useEffect(() =>
    {
        let relevant_wcomponents: WComponent[] = []

        if (show_back_references)
        {
            relevant_wcomponents = Object.values(wcomponents_by_id)
                .filter(wc => !wc.deleted_at)
                .filter(wc =>
                {
                    return wc.title.includes(wcomponent_id)
                        || wc.description.includes(wcomponent_id)
                        || (wcomponent_is_judgement_or_objective(wc) &&
                            (wc.judgement_target_wcomponent_id === wcomponent_id)
                        )
                        || (wcomponent_is_plain_connection(wc) &&
                            (
                                wc.from_id === wcomponent_id
                                || wc.to_id === wcomponent_id
                            )
                        )
                })
        }

        set_other_wcomponents(relevant_wcomponents)
    }, [wcomponent_id, wcomponents_by_id, show_back_references])

    if (!show_back_references) return <div>
        <Button
            value="Show back references"
            onClick={() => set_show_back_references(true)}
        />
    </div>


    if (other_wcomponents.length === 0) return <div>
        No back references
    </div>


    const created_at_ms = new Date().getTime()
    const sim_ms = created_at_ms


    return <div>
        Back references:

        {other_wcomponents.map(wcomponent =>
        {
            return <div>
                <Link
                    route={undefined}
                    sub_route={undefined}
                    item_id={wcomponent.id}
                    args={undefined}
                >
                    <Markdown>
                        {get_title({ rich_text: true, wcomponent, wcomponents_by_id, wc_id_to_counterfactuals_map: undefined, created_at_ms, sim_ms })}
                    </Markdown>
                </Link>
            </div>
        })}
    </div>
}

export const WComponentBackReferences = connector(_WComponentBackReferences) as FunctionalComponent<OwnProps>
