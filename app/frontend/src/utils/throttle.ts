// The difference between throttle and min_throttle is that:
//   throttle - returns a throttle function that when calls keeps pushing back the time
//              it will be invoked.  As such it collects all the possible calls to it if
//              they occur in a chain where the maximum time between any one call is the
//              delay_ms.  This is useful for throttling things like a user typing a search
//              term in a search box.
//   min_throttle - will always invoke after delay_ms and with the latest arguments that
//              have been passed to it.
//



export function throttle <A extends any[]> (func: (...args: A) => void, delay_ms: number)
{
    let timeout: NodeJS.Timeout | undefined = undefined


    const cancel = () =>
    {
        if (timeout)
        {
            clearTimeout(timeout)
            timeout = undefined
        }
    }


    let pending_args: A | undefined = undefined
    const throttled = (...args: A) =>
    {
        cancel()
        pending_args = args

        timeout = setTimeout(() =>
        {
            func(...args)
            pending_args = undefined
        }, delay_ms)
    }


    const flush = () =>
    {
        cancel()

        if (pending_args)
        {
            func(...pending_args)
            pending_args = undefined
        }
    }


    return { throttled, cancel, flush }
}



export function min_throttle <A extends any[], B extends any> (func: (...args: A) => B | undefined, delay_ms: number)
{
    let timeout: NodeJS.Timeout | undefined = undefined


    const cancel = () =>
    {
        if (timeout)
        {
            clearTimeout(timeout)
            timeout = undefined
        }
    }


    let pending_args: { args: A | undefined } = { args: undefined }
    let next_call_at_ms: number | undefined = undefined
    const throttled = (...args: A) =>
    {

        pending_args.args = args
        if (!timeout)
        {
            timeout = setTimeout(() =>
            {
                func(...pending_args.args!)
                pending_args.args = undefined
                timeout = undefined
            }, delay_ms)

            next_call_at_ms = performance.now() + delay_ms
        }

        return next_call_at_ms!
    }


    let will_flush: Promise<B | undefined> | undefined = undefined
    const flush = () =>
    {
        if (!will_flush)
        {
            will_flush = new Promise(resolve =>
            {

                setTimeout(() =>
                {
                    cancel()
                    will_flush = undefined

                    if (pending_args.args)
                    {
                        const args = pending_args.args
                        pending_args.args = undefined
                        resolve(func(...args))
                    }

                    resolve(undefined)
                }, 0)

            })
        }

        return will_flush
    }


    return { throttled, cancel, flush }
}
