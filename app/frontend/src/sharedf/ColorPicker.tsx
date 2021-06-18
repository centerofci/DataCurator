import { h } from "preact"
import { useState } from "preact/hooks"

import "./ColorPicker.css"
import { EditableNumber } from "../form/EditableNumber"
import type { Color } from "../shared/interfaces"
import { bounded } from "../shared/utils/bounded"
import { color_to_string } from "./color"



interface OwnProps
{
    color?: Color
    on_blur: (color: Color) => void
}


export function ColorPicker (props: OwnProps)
{
    const [color, _set_color] = useState<Color>(props.color || { r: 255, g: 255, b: 255, a: 1 })
    const set_color = (partial_color: Partial<Color>) =>
    {
        const valid_new_color = get_valid_new_color(color, partial_color)
        _set_color(valid_new_color)
    }


    const on_blur = (partial_color: Partial<Color>) =>
    {
        const valid_new_color = get_valid_new_color(color, partial_color)
        _set_color(valid_new_color)
        props.on_blur(valid_new_color)
    }


    return <div className="color_picker">
        <span className="description_label">r</span>
        <EditableNumber
            placeholder=""
            value={color.r}
            allow_undefined={false}
            on_change={r => set_color({ r })}
            on_blur={r => on_blur({ r })}
        />

        <span className="description_label">g</span>
        <EditableNumber
            placeholder=""
            value={color.g}
            allow_undefined={false}
            on_change={g => set_color({ g })}
            on_blur={g => on_blur({ g })}
        />

        <span className="description_label">b</span>
        <EditableNumber
            placeholder=""
            value={color.b}
            allow_undefined={false}
            on_change={b => set_color({ b })}
            on_blur={b => on_blur({ b })}
        />


        <div
            className="color_swatch"
            style={{ backgroundColor: color_to_string(color) }}
        />
    </div>
}



function get_valid_new_color (color: Color, partial_color: Partial<Color>)
{
    const new_color = { ...color, ...partial_color }
    const valid_new_color = validate_color(new_color)
    return valid_new_color
}


function validate_color (color: Color)
{
    let { r, g, b, a } = color

    r = bounded(r, 0, 255)
    g = bounded(g, 0, 255)
    b = bounded(b, 0, 255)
    a = bounded(a, 0, 1)

    return { r, g, b, a }
}