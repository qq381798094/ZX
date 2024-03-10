import {resolve} from "./usePromise.js"

export function socket() {
    console.log("socket")
    // ...

    setTimeout(() => {
        resolve({
            name: "steve"
        })
    }, 3000)
}