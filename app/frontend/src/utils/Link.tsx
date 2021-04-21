import { Component, ComponentClass, h } from "preact"
import type { Dispatch } from "redux"
import { connect, ConnectedProps } from "react-redux"

import "./Link.css"
import { merge_routing_state, routing_state_to_string } from "../state/routing/routing"
import type { RootState, ROUTE_TYPES, RoutingArgs, SUB_ROUTE_TYPES } from "../state/State"
import { ACTIONS } from "../state/actions"



interface OwnProps {
    route: ROUTE_TYPES | undefined
    sub_route: SUB_ROUTE_TYPES | undefined
    item_id: string | null | undefined
    args: Partial<RoutingArgs> | undefined
    on_click?: () => void
    selected_on?: Set<"route" | "args.view">
}


const map_state = (state: RootState, own_props: OwnProps) =>
{
    const current_routing_state = state.routing

    const { selected_on = new Set() } = own_props
    let selected = selected_on.size > 0

    if (selected_on.size)
    {
        if (selected_on.has("route") && own_props.route !== undefined) selected = selected && own_props.route === current_routing_state.route

        if (own_props.args)
        {
            if (selected_on.has("args.view") && own_props.args.view !== undefined) selected = selected && own_props.args.view === current_routing_state.args.view
        }
    }

    return {
        current_routing_state: state.routing,
        selected,
    }
}


const map_dispatch = (dispatch: Dispatch, own_props: OwnProps) => ({
    link_clicked: (routing_args: Partial<RoutingArgs>) => dispatch(ACTIONS.routing.change_route({
        route:     own_props.route,
        sub_route: own_props.sub_route,
        item_id:   own_props.item_id,
        args:      routing_args,
    }))
})


const connector = connect(map_state, map_dispatch)
type Props = ConnectedProps<typeof connector> & OwnProps

interface State { clicked: boolean }


class _Link extends Component<Props, State>
{
    constructor (props: Props)
    {
        super(props)
        this.state = { clicked: false }
    }

    private remove_clicked_class: NodeJS.Timeout | undefined
    componentWillUpdate (new_props: Props, new_state: State)
    {

        if (new_state.clicked && !this.remove_clicked_class)
        {

            this.remove_clicked_class = setTimeout(() => {

                this.setState({ clicked: false })
                this.remove_clicked_class = undefined

            }, 300)
        }
    }

    render ()
    {
        const partial_routing_args: Partial<RoutingArgs> = this.props.args || {}

        const on_click = (e: h.JSX.TargetedEvent<HTMLAnchorElement, MouseEvent>) => {
            if (this.props.selected) return // no-op

            this.setState({ clicked: true })

            if (this.props.on_click)
            {
                e.preventDefault()
                this.props.on_click()
            }
            else
            {
                this.props.link_clicked(partial_routing_args)
            }
        }

        const full_routing_state = merge_routing_state(this.props.current_routing_state, this.props)
        const full_routing_args = { ...this.props.current_routing_state.args, ...partial_routing_args }
        full_routing_state.args = full_routing_args

        const class_name = ("link " +
            (this.state.clicked ? " clicked_animate " : "") +
            (this.props.selected ? " selected " : ""))

        return <a
            onClick={on_click}
            href={routing_state_to_string({ ...full_routing_state })}
            className={class_name}
        >
            {this.props.children || "Link"}
        </a>
    }
}


export const Link = connector(_Link) as ComponentClass<OwnProps>


interface LinkButtonOwnProps extends OwnProps
{
    name: string
    style?: h.JSX.CSSProperties
}

function _LinkButton (props: Props & LinkButtonOwnProps)
{
    const partial_routing_args: Partial<RoutingArgs> = props.args || {}

    const on_click = (e: h.JSX.TargetedEvent<HTMLInputElement, MouseEvent>) => {
        if (props.selected) return // no-op

        if (props.on_click)
        {
            e.preventDefault()
            props.on_click()
        }
        else
        {
            props.link_clicked(partial_routing_args)
        }
    }

    const full_routing_state = merge_routing_state(props.current_routing_state, props)
    const full_routing_args = { ...props.current_routing_state.args, ...partial_routing_args }
    full_routing_state.args = full_routing_args

    return <input
        type="button"
        className={"styled " + (props.selected ? " selected " : "")}
        onClick={on_click}
        href={routing_state_to_string({ ...full_routing_state })}
        value={props.name || "Link"}
        style={props.style}
    />
}

export const LinkButton = connector(_LinkButton) as ComponentClass<OwnProps & LinkButtonOwnProps>
