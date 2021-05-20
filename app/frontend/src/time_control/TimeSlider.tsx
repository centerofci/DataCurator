import { FunctionalComponent, h } from "preact"
import { connect, ConnectedProps } from "react-redux"

import "./time_slider.css"
import { EditableCustomDateTime } from "../form/EditableCustomDateTime"
import type { RootState } from "../state/State"
import { find_nearest_index_in_sorted_list } from "../utils/binary_search"
import type { TimeSliderEvent } from "./interfaces"
import { NowButton } from "./NowButton"
import { floor_mseconds } from "../shared/utils/datetime"




interface OwnProps
{
    events: TimeSliderEvent[]
    get_handle_ms: (state: RootState) => number,
    change_handle_ms: (new_handle_ms: number) => void,
    data_set_name: string
}


const map_state = (state: RootState, { get_handle_ms }: OwnProps) => ({
    handle_datetime_ms: get_handle_ms(state),
    time_resolution: state.display.time_resolution,
})


const connector = connect(map_state)
type Props = ConnectedProps<typeof connector> & OwnProps


function _TimeSlider (props: Props)
{
    const event_start_datetimes_ms = props.events.map(event =>
    {
        let ms = event.datetime.getTime()
        ms = floor_mseconds(ms, props.time_resolution)
        return ms
    })

    const earliest_ms = event_start_datetimes_ms[0]
    const latest_ms = event_start_datetimes_ms[event_start_datetimes_ms.length - 1]

    const current_index = find_nearest_index_in_sorted_list(event_start_datetimes_ms, i => i, props.handle_datetime_ms)

    function changed_handle_position (e: h.JSX.TargetedEvent<HTMLInputElement, Event>)
    {
        const new_handle_datetime_ms = parseInt(e.currentTarget.value)
        props.change_handle_ms(new_handle_datetime_ms)
    }


    function move_to_event_datetime (direction: 1 | -1)
    {
        return () => {
            let next_index = current_index.index + direction

            if (!current_index.exact)
            {
                if (direction === 1) next_index = Math.ceil(current_index.index)
                else next_index = Math.floor(current_index.index)
            }

            let new_datetime_ms = event_start_datetimes_ms[next_index]
            while (new_datetime_ms === props.handle_datetime_ms)
            {
                next_index += direction
                new_datetime_ms = event_start_datetimes_ms[next_index]
            }

            if (!new_datetime_ms) return

            props.change_handle_ms(new_datetime_ms)
        }
    }


    return <div className="time_slider">
        <div className="slider_container">
            <input
                type="button"
                value="<"
                disabled={current_index.bounds === "n/a" || current_index.index <= 0}
                onClick={move_to_event_datetime(-1)}
            />
            <input
                type="button"
                value=">"
                disabled={current_index.bounds === "n/a" || current_index.index >= (event_start_datetimes_ms.length - 1)}
                onClick={move_to_event_datetime(1)}
            />
            <input
                type="range"
                onChange={changed_handle_position}
                onMouseUp={changed_handle_position}
                value={props.handle_datetime_ms}
                min={earliest_ms}
                max={latest_ms}
                list={"tickmarks_timeslider_" + props.data_set_name}
            />
        </div>
        <br />

        <datalist id={"tickmarks_timeslider_" + props.data_set_name}>
            {event_start_datetimes_ms.map(d => <option value={d}>{d}</option>)}
        </datalist>

        <div style={{ maxWidth: 200, display: "inline-flex", float: "right" }}>
            <EditableCustomDateTime
                invariant_value={undefined}
                value={new Date(props.handle_datetime_ms)}
                on_change={new_datetime => new_datetime && props.change_handle_ms(new_datetime.getTime())}
                show_now_shortcut_button={false}
                show_today_shortcut_button={false}
            />
            <NowButton change_datetime_ms={datetime_ms => props.change_handle_ms(datetime_ms)} />
        </div>

    </div>
}


export const TimeSlider = connector(_TimeSlider) as FunctionalComponent<OwnProps>
