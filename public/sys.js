import {promise} from "./usePromise.js"

export function sys() {
    console.log("sys")
    // ...

    promise.then(data => {
        console.log(data)
    })
}