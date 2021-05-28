import type { h } from "preact"

import type { ConnectionTerminalAttributeType, ConnectionTerminalType } from "../../shared/wcomponent/interfaces/SpecialisedObjects"
import type { CanvasPoint } from "../interfaces"



export interface Terminal
{
    type: ConnectionTerminalType
    style: h.JSX.CSSProperties
}



const connection_diameter = 12
export const connection_radius = connection_diameter / 2
const connection_left = 3
const connection_right = 250 + 3
const connection_top = 27
const connection_top_increment = 22


const attribute_type_to_ordinal: { [k in ConnectionTerminalAttributeType]: number } = {
    meta: 0,
    validity: 1,
    value: 2,
}

export function get_top_left_for_terminal_type (type: ConnectionTerminalType)
{
    const ordinal = attribute_type_to_ordinal[type.attribute]
    const top_offset = connection_top + (ordinal * connection_top_increment)

    const left_offset = (type.direction === "from" ? connection_right : connection_left)

    return { left: left_offset, top: top_offset }
}



export function get_connection_point (objective_node_position: CanvasPoint, type: ConnectionTerminalType): CanvasPoint
{
    const { left, top } = get_top_left_for_terminal_type(type)

    return {
        left: objective_node_position.left + left + connection_radius,
        top: objective_node_position.top + top + connection_radius,
    }
}
