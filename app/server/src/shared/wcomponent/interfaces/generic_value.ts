


export enum VAPsType {
    boolean,
    number,
    other,
    action,
    undefined,
}



export interface CurrentValuePossibility
{
    value: string | number | boolean
    probability: number
    conviction: number
    certainty: number
    uncertain: boolean
    assumed: boolean
    // likey?: boolean
}


export interface CurrentValue
{
    possibilities: CurrentValuePossibility[]

    is_defined: boolean
    value: undefined | string | number | boolean
    probability: number
    conviction: number
    certainty: number
    uncertain: boolean
    assumed: boolean
}



export interface UIValue
{
    is_defined: boolean
    values_string: string
    probabilities_string: string
    convictions_string: string
    assumed?: boolean
    uncertain?: boolean
}
