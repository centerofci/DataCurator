import { Component, h } from "preact"

import type { NodePositionAndDimensions } from "./interfaces"



interface CanvasNodeProps
{
    get_ref?: (ref: HTMLDivElement) => void
    position: NodePositionAndDimensions
    extra_styles?: h.JSX.CSSProperties
    display?: boolean
    extra_css_class?: string
    title?: string
    on_pointer_enter?: (e: h.JSX.TargetedEvent<HTMLDivElement, PointerEvent>) => void
    on_pointer_leave?: (e: h.JSX.TargetedEvent<HTMLDivElement, PointerEvent>) => void
    on_pointer_down?: (e: h.JSX.TargetedEvent<HTMLDivElement, PointerEvent>) => void
    on_click?: (e: h.JSX.TargetedEvent<HTMLDivElement, MouseEvent>) => void
    extra_args?: h.JSX.HTMLAttributes<HTMLDivElement>
}



export class CanvasNode extends Component<CanvasNodeProps>
{
    render ()
    {
        const { position, extra_styles, display, extra_css_class, title, children } = this.props
        const { on_pointer_enter, on_pointer_leave, on_pointer_down, on_click } = this.props

        const style_outer: h.JSX.CSSProperties = {
            ...position,
            display: display === undefined ? "" : (display ? "" : "none"),
            ...extra_styles,
        }

        const mouseable = (on_pointer_down || on_click || on_pointer_enter || on_pointer_leave) ? " mouseable " : ""

        const css_class_names = "graph_node " + mouseable + (extra_css_class || "")

        return <div
            {...(this.props.extra_args || {})}
            ref={ref => ref && this.props.get_ref && this.props.get_ref(ref)}
            className={css_class_names}
            style={style_outer}
            title={title}
            onPointerDown={on_pointer_down}
            onClick={on_click}
            onPointerEnter={on_pointer_enter}
            onPointerLeave={on_pointer_leave}
        >
            {children}
        </div>
    }
}
