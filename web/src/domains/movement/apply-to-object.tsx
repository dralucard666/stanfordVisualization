import { ObjectPosition, ObjectType, MovingObject as Primitive } from "cgv/domains/movement"
import { Value } from "cgv/interpreter"
import { Observable, Subscription, tap } from "rxjs"
import { Object3D } from "three"
import { ChangeType, valuesToChanges } from "cgv/interpreter"
import { framePositions, movObject, TimeState, useMovementStore } from "./useMovementStore"

export function applyToObject3D(
    input: Observable<Value<Primitive>>,
    object: Object3D,
    toObject: (value: Value<Primitive>) => Object3D,
    onError: (error: any) => void
): Subscription {
    return input.subscribe({
        next: (change) => {
            const data = change.raw
            console.log(change.raw.direction)
            if (data) {
                const startTime = data.position[0].time
                const endTime = data.position[data.position.length - 1].time
                const id = data.id
                const framePositions = formatToTimeData(data.position, startTime, endTime)
                const moveOb = {
                    id: data.id,
                    size: 30,
                    type: data.type,
                    framePos: framePositions,
                    startT: startTime,
                    endT: endTime,
                    direction: [data.direction.x, data.direction.y, data.direction.z],
                } as movObject

                const storeData = useMovementStore.getState().data
                const setStoreData = useMovementStore.getState().setData
                setStoreData(null)
                if (storeData) {
                    const indexOfCurrent = storeData.findIndex((e) => e.id === id)
                    if (indexOfCurrent !== -1) {
                        storeData[indexOfCurrent] = moveOb
                        setStoreData(storeData)
                    } else {
                        storeData.push(moveOb)
                        setStoreData(storeData)
                    }
                } else {
                    setStoreData([moveOb])
                }
                if (useMovementStore.getState().maxTime < endTime) {
                    useMovementStore.getState().setMaxTime(endTime)
                }
            }
            return
        },
        error: (error) => {
            onError(error)
        },
    })
}

function formatToTimeData(data: ObjectPosition[], startTime: number, endTime: number): framePositions[] {
    const framePos = [] as framePositions[]

    for (let x = startTime; x <= endTime; x++) {
        framePos.push({ time: x, position: null } as framePositions)
    }
    data.map(({ time, position }) => {
        framePos[time].position = [position.x, position.y, position.z]
    })
    return framePos
}
