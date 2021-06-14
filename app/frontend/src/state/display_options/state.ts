import type { TimeResolution } from "../../shared/utils/datetime"
// import type { Certainty } from "../../shared/uncertainty/quantified_language"



export interface BoundingRect
{
    width: number
    height: number
    left: number
    top: number
}


export function bounding_rects_equal (br1: BoundingRect | undefined, br2: BoundingRect | undefined): boolean
{
    if (br1 === undefined || br2 === undefined) return false

    return (br1.top === br2.top && br1.height === br2.height && br1.left === br2.left && br1.width === br2.width)
}



// export type ValidityToCertainty = {[k in Certainty] : ValidityDisplayOptions }
// interface ValidityDisplayOptions
// {
//     display: boolean
//     opacity: number
// }

export type ValidityFilterTypes = "only_certain_valid" | "only_maybe_valid" | "maybe_invalid" | "show_invalid"
export type ValidityFilterOption = {[type in ValidityFilterTypes]: boolean}

export type CertaintyFormattingTypes = "render_certainty_as_opacity" | "render_certainty_as_easier_opacity" | "render_100_opacity"
export type CertaintyFormattingOption = {[type in CertaintyFormattingTypes]: boolean}
// export type ValidityToCertainty_TypeToMap = {[k in ValidityToCertaintyTypes] : ValidityToCertainty }


export interface DisplayOptionsState
{
    consumption_formatting: boolean
    time_resolution: TimeResolution

    // Validity
    validity_filter: ValidityFilterTypes
    certainty_formatting: CertaintyFormattingTypes
    derived_validity_filter: ValidityFilterOption
    derived_certainty_formatting: CertaintyFormattingOption

    // not an option.  Move to a different part of the state object?
    canvas_bounding_rect: BoundingRect | undefined
}


const _time_resolution_types: {[P in TimeResolution]: true} = {
    minute: true,
    hour: true,
    day: true,
}
export const time_resolution_types: TimeResolution[] = Object.keys(_time_resolution_types) as any