import type { KnowledgeViewWComponentEntry } from "../../shared/interfaces/knowledge_view"
import type { ConnectionLineBehaviour, ConnectionTerminalType } from "../../wcomponent/interfaces/SpecialisedObjects"
import { get_angle, rads } from "../../utils/angles"
import { get_connection_point } from "./terminal"
import type { Vector } from "./utils"
import { NODE_WIDTH } from "../position_utils"
import { BAR_THICKNESS, ConnectionEndType, NOOP_THICKNESS } from "./ConnectionEnd"



const NODE_WIDTH_plus_fudge = NODE_WIDTH + 45
const minimum_line_bow = 30


interface DeriveCoordsArgs
{
    from_node_position: KnowledgeViewWComponentEntry
    to_node_position: KnowledgeViewWComponentEntry
    from_connection_type: ConnectionTerminalType
    to_connection_type: ConnectionTerminalType
    line_behaviour?: ConnectionLineBehaviour
    circular_links?: boolean
    end_size: number
    connection_end_type: ConnectionEndType
}
export function derive_coords (args: DeriveCoordsArgs )
{
    let {
        from_node_position, to_node_position, from_connection_type, to_connection_type,
        line_behaviour, circular_links, end_size, connection_end_type,
    } = args

    let y1_offset = 0
    let y2_offset = 0
    let x_control1_factor = 1
    let x_control2_factor = 1

    let circular_link_from_below_to: boolean | undefined = undefined
    let invert_end_angle = false
    if (circular_links)
    {
        if (from_node_position.left < (to_node_position.left - NODE_WIDTH_plus_fudge))
        {

        }
        else if (to_node_position.left < (from_node_position.left - NODE_WIDTH_plus_fudge))
        {
            y1_offset = 30
            y2_offset = 30
            to_connection_type = { ...to_connection_type, direction: "from" }
            from_connection_type = { ...from_connection_type, direction: "to" }
            invert_end_angle = true
        }
        else
        {
            circular_link_from_below_to = to_node_position.top < from_node_position.top
            if (circular_link_from_below_to)
            {
                from_connection_type = { ...from_connection_type, direction: "to" }
                y1_offset = 30
            }
            else
            {
                to_connection_type = { ...to_connection_type, direction: "from" }
                y2_offset = 30
                invert_end_angle = true
            }
        }
    }

    const from_connector_position = get_connection_point(from_node_position, from_connection_type)
    const to_connector_position = get_connection_point(to_node_position, to_connection_type)

    const x1 = from_connector_position.left
    const y1 = -from_connector_position.top + y1_offset

    const xe2 = to_connector_position.left
    const ye2 = -to_connector_position.top + y2_offset


    if (circular_link_from_below_to !== undefined)
    {
        if (x1 < xe2)
        {
            if (circular_link_from_below_to) x_control1_factor = -1
            else x_control2_factor = -1
        }
        else
        {
            if (circular_link_from_below_to) x_control2_factor = -1
            else x_control1_factor = -1
        }
    }


    let relative_control_point1: Vector = { x: 0, y: 0 }
    let relative_control_point2 = relative_control_point1

    const angle = get_angle(x1, y1, xe2, ye2)
    let end_angle = angle + rads._180

    if (line_behaviour === undefined || line_behaviour === "curve")
    {
        const xc = (xe2 - x1) / 2
        const min_xc = Math.max(Math.abs(xc), minimum_line_bow) * (Math.sign(xc) || -1)
        let x_control1 = min_xc * x_control1_factor
        let x_control2 = -min_xc * x_control2_factor
        let y_control1 = 0
        let y_control2 = 0

        const going_right_to_left = xe2 <= x1
        if (!circular_links && going_right_to_left)
        {
            const y_diff = ye2 - y1

            x_control1 = Math.min(-x_control1, 300)
            x_control2 = Math.max(-x_control2, -300)
            y_control1 = y_diff || -minimum_line_bow
            y_control2 = -y_diff || -minimum_line_bow
        }

        end_angle = invert_end_angle ? 0 : rads._180

        relative_control_point1 = { x: x_control1, y: y_control1 }
        relative_control_point2 = { x: x_control2, y: y_control2 }
    }


    // Connect to start of arrow / block / diamond etc
    const minimum_end_connector_shape_size = connection_end_type === ConnectionEndType.negative
        ? (BAR_THICKNESS * end_size)
        : connection_end_type === ConnectionEndType.noop ? NOOP_THICKNESS : (9 * end_size)
    const xo2 = xe2 + Math.cos(end_angle) * minimum_end_connector_shape_size
    const yo2 = ye2 + Math.sin(end_angle) * minimum_end_connector_shape_size


    return {
        x1, y1, xe2, ye2, xo2, yo2, relative_control_point1, relative_control_point2, end_angle
    }
}



interface BezierMiddleArgs
{
    point1: Vector
    point2: Vector
    relative_control_point1: Vector
    relative_control_point2: Vector
}
export function bezier_middle (args: BezierMiddleArgs)
{
    const C1 = add_point(args.point1, args.relative_control_point1)
    const C2 = add_point(args.point2, args.relative_control_point2)

    const E = average_point(args.point1, C1)
    const F = average_point(C1, C2)
    const G = average_point(C2, args.point2)

    const H = average_point(E, F)
    const I = average_point(F, G)

    return average_point(H, I)
}



function add_point (point1: Vector, point2: Vector): Vector
{
    return {
        x: point1.x + point2.x,
        y: point1.y + point2.y,
    }
}



function average_point (point1: Vector, point2: Vector): Vector
{
    return {
        x: (point1.x + point2.x) / 2,
        y: (point1.y + point2.y) / 2,
    }
}
