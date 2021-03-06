import { h } from "preact"



interface OwnProps {
    items_descriptor: string
    items_descriptor_title?: string
    on_click_header?: () => void
    other_content?: () => h.JSX.Element | null
}


export function ListHeader (props: OwnProps)
{
    const {
        items_descriptor,
        on_click_header,
        other_content = () => null,
    } = props


    return <div
        onClick={e =>
        {
            e.stopImmediatePropagation()
            on_click_header && on_click_header()
        }}
        style={{ cursor: on_click_header ? "pointer" : "default" }}
        title={props.items_descriptor_title}
    >
        {other_content()}

        <div className="item_descriptors">{items_descriptor}</div>

        <div style={{ clear: "both" }}></div>
    </div>
}
