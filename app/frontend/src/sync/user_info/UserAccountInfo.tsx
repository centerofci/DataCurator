import { h } from "preact"

import { Modal } from "../../modal/Modal"
import { UserAccountInfoForm } from "./UserAccountInfoForm"



interface OwnProps
{
    on_close?: () => void
}


export function UserAccountInfo (props: OwnProps)
{
    const { on_close } = props

    return <Modal
        title={<div style={{ margin: 10 }}>
            <h2>User Account</h2>
        </div>}
        size="medium"


        on_close={!on_close ? undefined : e =>
        {
            e?.stopImmediatePropagation()
            on_close()
        }}


        child={<UserAccountInfoForm on_close={on_close}/>}
    />
}
