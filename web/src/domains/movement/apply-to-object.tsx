import { ObjectPosition, ObjectType, Primitive } from "cgv/domains/movement"
import { Value } from "cgv/interpreter"
import { Observable, Subscription, tap } from "rxjs"
import { Object3D } from "three"
import { ChangeType, valuesToChanges } from "cgv/interpreter"
import { framePositions, objectPos, useMovementStore } from "./useMovementStore"

export function applyToObject3D(
    input: Observable<Value<Primitive>>,
    object: Object3D,
    toObject: (value: Value<Primitive>) => Object3D,
    onError: (error: any) => void
): Subscription {
    return input.subscribe({
        next: (change) => {
            const data = change.raw.position
            if (data) {
                const formData = formatToTimeData(data)
                console.log(formData)
                useMovementStore.getState().setData(formData)
            }
            return
        },
        error: (error) => {
            onError(error)
        },
    })
}

function formatToTimeData(data: ObjectPosition[]): framePositions[] {
    return data.map(({ time, position }) => {
        return {
            time,
            obPositions: [[0, position.x, position.y, position.z, 10, ObjectType.Pedestrian] as objectPos],
        } as framePositions
    })
}
