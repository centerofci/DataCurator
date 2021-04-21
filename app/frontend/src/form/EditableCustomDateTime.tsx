import { h, Component } from "preact"

import "./Editable.css"
import { date_to_string, valid_date_str, str_to_date, correct_datetime_for_local_time_zone } from "./datetime_utils"



interface OwnProps
{
    invariant_value: Date | undefined
    value: Date | undefined
    on_change?: (new_value: Date | undefined) => void
}


const shorten_if_only_days = true

interface State
{
    working_value: string
}

export class EditableCustomDateTime extends Component <OwnProps, State>
{
    constructor (props: OwnProps)
    {
        super(props)
        const working_value = props_to_working_value(this.props)
        this.state = { working_value }
    }

    componentWillReceiveProps (next_props: OwnProps)
    {
        const new_working_value = props_to_working_value(next_props)
        if (props_to_working_value(this.props) !== new_working_value)
        {
            this.setState({ working_value: new_working_value })
        }
    }

    set_working_value = (working_value: string) =>
    {
        this.setState({ working_value })
    }

    render ()
    {
        const { working_value } = this.state
        const valid = !!(working_value && valid_date_str(working_value))


        const { on_change } = this.props
        if (!on_change) return <div>{working_value}</div>


        const class_name = "editable_field " + (valid ? "" : "invalid ")
        const title = "Created at " + (this.props.value ? "(custom)" : "")

        return <div className={class_name} title={title}>
            <input
                type="text"
                value={working_value}
                onFocus={e => handle_on_focus(e, props_value(this.props), this.set_working_value)}
                onChange={e => this.set_working_value(e.currentTarget.value)}
                onBlur={() => handle_on_blur({
                    valid, working_value, props: this.props, set_working_value: this.set_working_value, on_change
                })}
            />
        </div>
    }
}



function props_value (props: OwnProps)
{
    const value = props.value || props.invariant_value
    return value
}



function props_to_working_value (props: OwnProps)
{
    const value = props_value(props)
    const working_value = date_to_string(value, shorten_if_only_days)
    return working_value
}



function handle_on_focus (e: h.JSX.TargetedFocusEvent<HTMLInputElement>, value: Date | undefined, set_working_value: (v: string) => void)
{
    const date_value = e.currentTarget.value ? value : new Date()
    const value_str = date_to_string(date_value, false)
    e.currentTarget.value = value_str
    set_working_value(value_str)

    e.currentTarget.setSelectionRange(0, e.currentTarget.value.length)
}



interface HandleOnBlurArgs
{
    valid: boolean
    working_value: string
    props: {
        invariant_value: Date | undefined
        value: Date | undefined
    }
    set_working_value: (v: string) => void
    on_change: (v: Date | undefined) => void
}
function handle_on_blur (args: HandleOnBlurArgs): void {
    const { valid, working_value, props, set_working_value, on_change } = args

    let new_value: Date | undefined
    if (!valid)
    {
        // Custom date is not valid
        new_value = undefined
    }
    else if (str_to_date(working_value).getTime() === (props.invariant_value && props.invariant_value.getTime()))
    {
        // Custom date is not needed
        new_value = undefined
    }
    else
    {
        const corrected_datetime = correct_datetime_for_local_time_zone(working_value)

        if (corrected_datetime.getTime() === props.value?.getTime())
        {
            const date_value_str = date_to_string(props.value, shorten_if_only_days)
            // Still need to set this in case it was a date with only days for the user's timezone,
            // i.e. if it was "2021-04-16 00:00", this needs to be re-rendered as "2021-04-16"
            set_working_value(date_value_str)
            return
        }

        new_value = corrected_datetime
    }

    const date_value_str = date_to_string(new_value || props.invariant_value, shorten_if_only_days)
    set_working_value(date_value_str)
    on_change(new_value)
}
