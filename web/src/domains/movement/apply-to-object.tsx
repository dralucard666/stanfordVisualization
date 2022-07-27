import { ObjectPosition, Primitive } from "cgv/domains/movement"
import { Value } from "cgv/interpreter"
import { Observable, Subscription, tap } from "rxjs"
import { Object3D } from "three"
import { ChangeType, valuesToChanges } from "cgv/interpreter"

export function applyToObject3D(
    input: Observable<Value<Primitive>>,
    object: Object3D,
    toObject: (value: Value<Primitive>) => Object3D,
    onError: (error: any) => void
): Subscription {
    return input.subscribe({
        next: (change) => {
            console.log(change)
            const data=change.raw.position
            if (data) { 
                formatToTimeData(data)
            }
            return
        },
        error: (error) => {
            onError(error)
        },
    })
}


function formatToTimeData(data:ObjectPosition[]) {


    

    return
}
