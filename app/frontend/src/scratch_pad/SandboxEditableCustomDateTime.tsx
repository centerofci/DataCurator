import { h } from "preact"
import { useState } from "preact/hooks"
import { EditableCustomDateTime } from "../form/EditableCustomDateTime"



export function SandboxEditableCustomDateTime ()
{
    const [custom_date, set_custom_date] = useState<Date | undefined>(undefined)
    const [some_date, set_some_date] = useState(new Date())

    return <div>
        EditableCustomDateTime <div onClick={() => set_custom_date(new Date("2000-01-01"))}>testing</div>
        {/* <EditableCustomDateTime
            invariant_value={undefined} //new Date("2021-04-15 14:02")}
            value={custom_date}
            on_change={custom_date => set_custom_date(custom_date)}
        />
        <EditableCustomDateTime
            invariant_value={undefined} //new Date("2021-04-15 14:02")}
            value={custom_date}
            on_change={custom_date => set_custom_date(custom_date)}
        /> */}

        Mimic timeslider:
        <EditableCustomDateTime
            invariant_value={undefined}
            value={some_date}
            on_change={custom_date => custom_date && set_some_date(custom_date)}
        />
    </div>
}