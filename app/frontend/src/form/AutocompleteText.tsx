import { Component, h, Options } from "preact"
import fuzzysort from "fuzzysort"

import "./AutocompleteText.css"
import { sort_list } from "../shared/utils/sort"



export interface AutoCompleteOption
{
    id: string | undefined
    title: string
}


export interface AutoCompleteProps <E extends AutoCompleteOption>
{
    placeholder: string
    selected_option_id: string | undefined
    get_options: (current_value: string) => E[]
    allow_none?: boolean
    on_focus?: () => void
    on_blur?: () => void
    on_change: (id: E["id"] | undefined) => void
    on_mouse_over_option?: (id: E["id"] | undefined) => void
    on_mouse_leave_option?: (id: E["id"] | undefined) => void
    extra_styles?: h.JSX.CSSProperties
    start_expanded?: boolean
}



interface OwnProps <E extends AutoCompleteOption> extends AutoCompleteProps<E> {}


interface State
{
    temp_value_str: string | undefined
    editing: boolean
    highlighted_option_index: number | undefined
}

export class AutocompleteText <E extends AutoCompleteOption> extends Component <OwnProps<E>, State>
{
    private original_options: E[] = []
    private options: E[] = []
    private prepared_targets: (Fuzzysort.Prepared | undefined)[] = []

    constructor (props: OwnProps<E>)
    {
        super(props)
        this.state = {
            temp_value_str: undefined,
            // option_id: props.selected_option_id,
            editing: !!props.start_expanded,
            highlighted_option_index: undefined,
        }
    }


    async handle_key_down (e: h.JSX.TargetedKeyboardEvent<HTMLInputElement>, displayed_options: E[])
    {
        const key = e.key

        const is_arrow_down = key === "ArrowDown"
        const is_arrow_up = key === "ArrowUp"
        const is_enter = key === "Enter"

        let { highlighted_option_index } = this.state

        if (!(is_arrow_down || is_arrow_up || is_enter))
        {
            highlighted_option_index = undefined
        }
        else if (is_enter)
        {
            if (highlighted_option_index !== undefined)
            {
                const selected_option = displayed_options[highlighted_option_index]
                if (selected_option) await this.conditional_on_change(selected_option.id)
            }

            e.currentTarget.blur()
        }
        else if (highlighted_option_index === undefined) highlighted_option_index = 0
        else
        {
            highlighted_option_index += (is_arrow_down ? 1 : -1)
            highlighted_option_index = highlighted_option_index % displayed_options.length
        }

        this.setState({ highlighted_option_index })
    }


    get_selected_option_title (): string
    {
        const selected_option = this.props.get_options("").find(({ id }) => id === this.props.selected_option_id)

        return selected_option ? selected_option.title : "-"
    }


    get_value_str ()
    {
        if (this.state.temp_value_str !== undefined) return this.state.temp_value_str

        return this.get_selected_option_title()
    }


    get_options_to_display ()
    {
        const new_options = this.props.get_options(this.state.temp_value_str || "")

        if (new_options !== this.original_options)
        {
            this.original_options = new_options
            this.options = [...new_options]
            if (this.props.allow_none)
            {
                // allow user to clear the current value / select none
                const option_none: AutoCompleteOption = { id: undefined, title: "-" }
                this.options.unshift(option_none as any)
            }
            this.prepared_targets = this.options.map(o => fuzzysort.prepare(o.title))
        }


        if (!this.state.temp_value_str)
        {
            return this.options
        }


        const search_options = {
            limit: 100, // don't return more results than we need
            allowTypo: true,
            threshold: -10000, // don't return bad results
        }
        const results = fuzzysort.go(this.state.temp_value_str, this.prepared_targets, search_options)

        const map_target_to_score: { [target: string]: number } = {}
        results.forEach(({ target, score }) => map_target_to_score[target] = score)

        const options_to_display: E[] = sort_list(this.options, o =>
            {
                const score = map_target_to_score[o.title]
                return score === undefined ? -10000 : score
            }, "descending")

        return options_to_display
    }


    conditional_on_change = async (id: E["id"] | undefined) =>
    {
        await new Promise<void>(resolve =>
        {
            this.setState({ editing: false, temp_value_str: undefined }, resolve)
        })

        const original_id = this.props.selected_option_id
        if (original_id !== id)
        {
            this.props.on_change(id)
        }
    }


    render ()
    {
        const options_to_display = this.get_options_to_display()
        const value_str = this.get_value_str()

        const final_value = get_valid_value(options_to_display, value_str)
        const valid = !final_value || value_str.toLowerCase() === final_value.title.toLowerCase()

        const {
            placeholder,
            on_focus = () => {},
            on_blur = () => {},
            on_mouse_over_option = () => {},
            on_mouse_leave_option = () => {},
        } = this.props


        const is_option_wrapper_highlighted = (option: E, index: number): boolean =>
        {
            const { highlighted_option_index } = this.state
            if (highlighted_option_index !== undefined) return index === highlighted_option_index

            return !!final_value && option.id === final_value.id
        }


        return <div
            class={"editable_field autocomplete " + (valid ? "" : "invalid ")}
            style={this.props.extra_styles}
        >
            <input
                ref={r =>
                {
                    if (!r || !this.state.editing) return
                    r.focus()
                }}
                type="text"
                placeholder={placeholder}
                value={value_str}
                onFocus={e => {
                    this.setState({ editing: true })
                    on_focus()
                    // select all text
                    e.currentTarget.setSelectionRange(0, e.currentTarget.value.length)
                }}
                onChange={e => this.setState({ temp_value_str: e.currentTarget.value })}
                onKeyDown={e => this.handle_key_down(e, options_to_display)}
                onBlur={() => {
                    if (this.state.editing)
                    {
                        this.conditional_on_change(final_value ? final_value.id : undefined)
                    }

                    on_blur()
                }}
            />

            <Options
                editing={this.state.editing}
                options_to_display={options_to_display}
                is_option_wrapper_highlighted={is_option_wrapper_highlighted}
                conditional_on_change={this.conditional_on_change}
                set_highlighted_option_index={index => this.setState({ highlighted_option_index: index })}
                on_mouse_over_option={on_mouse_over_option}
                on_mouse_leave_option={on_mouse_leave_option}
            />
        </div>
    }
}


function get_valid_value <E extends AutoCompleteOption> (options: E[], value_str: string): E | undefined
{
    const lower_value_str = value_str.toLowerCase()

    const match = options.find(option => option.title.toLowerCase() === lower_value_str)
    if (match) return match

    return options[0]
}



interface OptionsOwnProps <E>
{
    editing: boolean
    options_to_display: E[]
    is_option_wrapper_highlighted: (option: E, index: number) => boolean
    conditional_on_change: (option_id: string | undefined) => void
    set_highlighted_option_index: (index: number) => void
    on_mouse_over_option: (option_id: string | undefined) => void
    on_mouse_leave_option: (option_id: string | undefined) => void
}
function Options <E extends AutoCompleteOption> (props: OptionsOwnProps<E>)
{
    const { editing, options_to_display, is_option_wrapper_highlighted, conditional_on_change,
        set_highlighted_option_index, on_mouse_over_option, on_mouse_leave_option, } = props

    if (options_to_display.length === 0) return null

    return <div className="options_outer" style={{ display: editing ? "" : "none" }}>
        <div className="options_inner">
            {options_to_display.map((option, index) => <div
                className={"option_wrapper " + (is_option_wrapper_highlighted(option, index) ? " highlighted " : "")}
                onMouseDown={() => conditional_on_change(option.id)}
                onMouseOver={() => {
                    set_highlighted_option_index(index)
                    on_mouse_over_option(option.id)
                }}
                onMouseLeave={() => on_mouse_leave_option(option.id)}
            >
                <div className="option">{option.title || option.id || "none"}</div>
            </div>)}
        </div>
    </div>
}
