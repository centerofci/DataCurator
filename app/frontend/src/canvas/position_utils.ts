import { test } from "../shared/utils/test"
import { round_coordinate20 } from "../state/display/display"
import type { BoundingRect } from "../state/display/state"
import { bounded } from "../utils/utils"
import type { CanvasPoint, Position } from "./interfaces"
import { scale_by } from "./zoom_utils"



export function position_to_point (position: Position): CanvasPoint
{
    return { left: position.x, top: -position.y }
}



export function round_canvas_point (point: CanvasPoint): CanvasPoint
{
    return { left: round_coordinate20(point.left), top: round_coordinate20(point.top) }
}



interface CalculateXyFromClientXyArgs
{
    client_x: number
    client_y: number
    canvas_bounding_rect: BoundingRect
    x: number
    y: number
    zoom: number
}
export function calculate_xy_from_client_xy (args: CalculateXyFromClientXyArgs): Position
{
    const {
        client_x,
        client_y,
        canvas_bounding_rect,
        x: view_x,
        y: view_y,
        zoom,
    } = args

    let x = client_x - canvas_bounding_rect.left
    let y = client_y - canvas_bounding_rect.top

    x = bounded(x, 0, canvas_bounding_rect.width)
    y = bounded(y, 0, canvas_bounding_rect.height)

    const scale = scale_by / zoom

    x = x * scale
    y = y * scale

    x += view_x
    y += view_y

    return { x, y }
}


function run_tests ()
{
    console. log("running tests for calculate_xy_from_client_xy")

    let client: { client_x: number; client_y: number }
    let canvas_bounding_rect: BoundingRect = { width: 600, height: 900, left: 10, top: 15 }
    let x: number
    let y: number
    let zoom: number

    const top_left = (offset_x?: number, offset_y?: number) => ({
        client_x: canvas_bounding_rect.left + (offset_x !== undefined ? offset_x : 0),
        client_y: canvas_bounding_rect.top + (offset_y !== undefined ? offset_y : 0),
    })
    const bottom_right = (offset_x?: number, offset_y?: number) => ({
        client_x: canvas_bounding_rect.width + canvas_bounding_rect.left + (offset_x !== undefined ? offset_x : 0),
        client_y: canvas_bounding_rect.height + canvas_bounding_rect.top + (offset_y !== undefined ? offset_y : 0),
    })

    let result: Position

    x = 0
    y = 0
    zoom = 100

    // Should handle client xy which is out of bounds of canvas rect
    client = top_left(-1, -1)
    result = calculate_xy_from_client_xy({ ...client, canvas_bounding_rect, x, y, zoom, })
    test(result, { x: 0, y: 0 })

    client = bottom_right(1, 1)
    result = calculate_xy_from_client_xy({ ...client, canvas_bounding_rect, x, y, zoom, })
    test(result, {
        x: canvas_bounding_rect.width,
        y: canvas_bounding_rect.height,
    })

    // calc x y for bottom_right of canvas
    client = bottom_right()
    result = calculate_xy_from_client_xy({ ...client, canvas_bounding_rect, x, y, zoom, })
    test(result, {
        x: canvas_bounding_rect.width,
        y: canvas_bounding_rect.height,
    })

    // calc x y for top left when translated
    client = top_left()
    x = 100
    y = 100
    result = calculate_xy_from_client_xy({ ...client, canvas_bounding_rect, x, y, zoom, })
    test(result, { x, y })

    // calc x y for bottom right when translated
    client = bottom_right()
    x = 100
    y = 100
    result = calculate_xy_from_client_xy({ ...client, canvas_bounding_rect, x, y, zoom, })
    test(result, { x: x + canvas_bounding_rect.width, y: y + canvas_bounding_rect.height })

    // calc x y for top left when zoomed in
    client = top_left()
    x = 0
    y = 0
    zoom = 200
    result = calculate_xy_from_client_xy({ ...client, canvas_bounding_rect, x, y, zoom, })
    test(result, { x, y })

    // calc x y for bottom right when zoomed in
    client = bottom_right()
    x = 0
    y = 0
    zoom = 200
    result = calculate_xy_from_client_xy({ ...client, canvas_bounding_rect, x, y, zoom, })
    test(result, {
        x: canvas_bounding_rect.width / 2,
        y: canvas_bounding_rect.height / 2,
    })

    // calc x y for bottom right when zoomed out
    client = bottom_right()
    x = 0
    y = 0
    zoom = 50
    result = calculate_xy_from_client_xy({ ...client, canvas_bounding_rect, x, y, zoom, })
    test(result, {
        x: canvas_bounding_rect.width * 2,
        y: canvas_bounding_rect.height * 2,
    })

    // calc x y for top left when translated and zoomed in
    x = 100
    y = 100
    zoom = 200
    client = top_left()
    result = calculate_xy_from_client_xy({ ...client, canvas_bounding_rect, x, y, zoom, })
    test(result, { x, y })

    // calc x y for bottom right when translated and zoomed in
    client = bottom_right()
    result = calculate_xy_from_client_xy({ ...client, canvas_bounding_rect, x, y, zoom, })
    test(result, {
        x: x + canvas_bounding_rect.width / 2,
        y: y + canvas_bounding_rect.height / 2,
    })
}

// run_tests()
