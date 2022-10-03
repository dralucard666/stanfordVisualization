import { MovingObject, ObjectPosition, ObjectType, Primitive } from "cgv/domains/movement"
import { Value } from "cgv/interpreter"
import { Observable, Subscription, tap } from "rxjs"
import { Object3D } from "three"
import { ChangeType, valuesToChanges } from "cgv/interpreter"
import { framePositions, movObject, TimeState, useMovementStore } from "./useMovementStore"

export function applyToObject3D(
    input: Observable<Value<Primitive>>,
    name: string,
    object: Object3D,
    toObject: (value: Value<Primitive>) => Object3D,
    onError: (error: any) => void
): Subscription {
    return input.subscribe({
        next: (change) => {
            const data = change.raw
            if (data instanceof MovingObject) {
                const startTime = data.position[0].time
                const endTime = data.position[data.position.length - 1].time
                const id = name
                const framePositions = formatToTimeData(data.position, startTime, endTime)
                const moveOb = {
                    id: id,
                    size: 30,
                    type: data.type,
                    framePos: framePositions,
                    startT: startTime,
                    endT: endTime,
                    direction: [
                        data.position[0].direction.x,
                        data.position[0].direction.y,
                        data.position[0].direction.z,
                    ],
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
                if (useMovementStore.getState().minTime > startTime) {
                    useMovementStore.getState().setMinTime(startTime)
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
        framePos.push({ time: x, position: null, direction: null } as framePositions)
    }
    data.map(({ time, position, direction }) => {
        framePos[time - startTime].position = [position.x, position.y, position.z]
        framePos[time - startTime].direction = [direction.x, direction.y, direction.z]
    })
    return framePos
}
