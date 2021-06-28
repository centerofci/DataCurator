import { FunctionalComponent, h } from "preact"

import type { ContentCoordinate } from "../canvas/interfaces"
import type { ChildrenRawData } from "../layout/interfaces"
import type { RootState } from "../state/State"
import { WComponentCanvasNode } from "../knowledge/canvas_node/WComponentCanvasNode"
import { Canvas } from "../canvas/Canvas"
import { MainArea } from "../layout/MainArea"
import { connect, ConnectedProps } from "react-redux"
import { sort_list } from "../shared/utils/sort"
import type { WComponent } from "../shared/wcomponent/interfaces/SpecialisedObjects"
import { get_created_at_ms } from "../shared/wcomponent/utils_datetime"



const map_state = (state: RootState) =>
{
    const sync_ready = state.sync.ready

    const { current_UI_knowledge_view } = state.derived

    if (sync_ready && !current_UI_knowledge_view) console .log(`No current_UI_knowledge_view`)


    const { selected_wcomponent_ids_map } = state.meta_wcomponents


    let wcomponent_nodes: WComponent[] = []
    if (current_UI_knowledge_view)
    {
        wcomponent_nodes = current_UI_knowledge_view.wcomponent_nodes
    }


    return {
        sync_ready,
        wcomponent_nodes,
        wcomponent_connections: current_UI_knowledge_view && current_UI_knowledge_view.wcomponent_connections,
        presenting: state.display_options.consumption_formatting,
        selected_wcomponent_ids_map,
    }
}

const connector = connect(map_state)
type Props = ConnectedProps<typeof connector>



function _KnowledgeTimeView (props: Props)
{
    const { elements, content_coordinates } = get_children(props)

    return <MainArea
        main_content={<Canvas
            svg_children={[]}
            svg_upper_children={get_svg_upper_children(props)}
            content_coordinates={content_coordinates}
            plain_background={props.presenting}
        >
            {elements}
        </Canvas>}
    />
}

export const KnowledgeTimeView = connector(_KnowledgeTimeView) as FunctionalComponent<{}>



const no_children: h.JSX.Element[] = []
const default_content_coordinates: ContentCoordinate[] = [{ left: 0, top: 0, zoom: 100 }]
const get_children = (props: Props): ChildrenRawData =>
{
    const { sync_ready } = props
    let { wcomponent_nodes } = props
    if (!sync_ready || !wcomponent_nodes)
    {
        return { elements: no_children, content_coordinates: default_content_coordinates }
    }


    const { selected_wcomponent_ids_map } = props
    const get_key = (wc: WComponent) =>
    {
        const entry = selected_wcomponent_ids_map[wc.id]

        if (entry !== undefined) return entry
        else return get_created_at_ms(wc)
    }

    wcomponent_nodes = sort_list(wcomponent_nodes, get_key, "ascending")


    const elements = wcomponent_nodes.map(({ id }) => <WComponentCanvasNode
        key={id}
        id={id}
        on_graph={false}
    />)


    return {
        elements,
        content_coordinates: default_content_coordinates,
    }
}



const no_svg_upper_children: h.JSX.Element[] = []
const get_svg_upper_children = ({ wcomponent_connections }: Props) =>
{
    return null
    // if (!wcomponent_connections) return no_svg_upper_children

    // return wcomponent_connections.map(({ id }) => <WComponentCanvasConnection key={id} id={id} />)
}