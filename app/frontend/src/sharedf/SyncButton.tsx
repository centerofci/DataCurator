import { h } from "preact"
import SyncIcon from "@material-ui/icons/Sync"
import SyncProblemIcon from "@material-ui/icons/SyncProblem"

import type { AsyncState } from "../utils/async_state"



interface Props
{
    state: AsyncState
    text?: string
    title?: string
    on_click: () => void
    style?: h.JSX.CSSProperties
}

export function SyncButton (props: Props)
{
    const { state, text = "Refresh", title = "Refresh", on_click, style } = props
    const error = state === "error"

    return <span title={title} onClick={on_click} style={style}>
        {text}
        {!error && <SyncIcon className={state === "in_progress" ? "animate spinning" : ""} />}
        {error && <SyncProblemIcon />}
    </span>
}
