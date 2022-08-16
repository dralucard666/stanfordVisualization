import { of } from "rxjs"
import { Vector3 } from "three"
import { possibleAngles, possibleDistance } from "./operations"

export enum ObjectType {
    Pedestrian,
    Cyclist,
    Car,
}

const standardTime = 300

export interface ObjectPosition {
    position: Vector3
    time: number
    direction: Vector3
}

export class MovingObject {
    constructor(public id: number, public position: ObjectPosition[], public type: ObjectType) {}

    moveRight(distance: number) {
        const oldPo = this.position[this.position.length - 1]
        const newPo = {
            position: oldPo.position.clone().setX(oldPo.position.x + distance),
            time: oldPo.time + standardTime,
        } as ObjectPosition

        const newTimeSteps = this.returnNewTimeSteps(oldPo, newPo, new Vector3(1, 0, 0))
        const newPosArray = structuredClone(this.position)
        newPosArray.push(...newTimeSteps)
        return new MovingObject(this.id, newPosArray, this.type)
    }

    moveLeft(distance: number) {
        const oldPo = this.position[this.position.length - 1]
        const newPo = {
            position: oldPo.position.clone().setX(oldPo.position.x - distance),
            time: oldPo.time + standardTime,
        } as ObjectPosition

        const newTimeSteps = this.returnNewTimeSteps(oldPo, newPo, new Vector3(-1, 0, 0))
        const newPosArray = structuredClone(this.position)
        newPosArray.push(...newTimeSteps)
        return new MovingObject(this.id, newPosArray, this.type)
    }

    moveUp(distance: number) {
        const oldPo = this.position[this.position.length - 1]
        const newPo = {
            position: oldPo.position.clone().setZ(oldPo.position.z + distance),
            time: oldPo.time + standardTime,
        } as ObjectPosition

        const newTimeSteps = this.returnNewTimeSteps(oldPo, newPo, new Vector3(0, 0, 1))
        const newPosArray = structuredClone(this.position)
        newPosArray.push(...newTimeSteps)
        return new MovingObject(this.id, newPosArray, this.type)
    }

    moveDown(distance: number) {
        const oldPo = this.position[this.position.length - 1]
        const newPo = {
            position: oldPo.position.clone().setZ(oldPo.position.z - distance),
            time: oldPo.time + standardTime,
        } as ObjectPosition

        const newTimeSteps = this.returnNewTimeSteps(oldPo, newPo, new Vector3(0, 0, -1))
        const newPosArray = structuredClone(this.position)
        newPosArray.push(...newTimeSteps)
        return new MovingObject(this.id, newPosArray, this.type)
    }

    moveRotate(angle: possibleAngles, distance: possibleDistance) {
        const oldPo = this.position[this.position.length - 1]
        const direction = this.position[this.position.length - 1].direction
        const newDirection = direction.applyAxisAngle(new Vector3(0, 1, 0), (angle / 180) * Math.PI)
        const newPo = {
            position: oldPo.position.clone().add(newDirection.multiplyScalar(distance)),
            time: oldPo.time + standardTime,
        } as ObjectPosition
        const newTimeSteps = this.returnNewTimeSteps2(oldPo, newPo, newDirection.normalize())
        const newPosArray = structuredClone(this.position)
        newPosArray.push(...newTimeSteps)
        return new MovingObject(this.id, newPosArray, this.type)
    }

    returnNewTimeSteps(oldPo: ObjectPosition, newPo: ObjectPosition, direction: Vector3): ObjectPosition[] {
        const missingPos: ObjectPosition[] = []
        const oldVec = oldPo.position
        const newVec = newPo.position
        const diffVec = newVec.sub(oldVec)
        const oldTime = oldPo.time
        const diffTime = newPo.time - oldTime
        for (let i = 1; i < diffTime + 1; i++) {
            const addVec = diffVec.clone().multiplyScalar(i / diffTime)
            missingPos.push({
                time: oldTime + i,
                position: oldVec.clone().add(addVec),
                direction: direction.clone(),
            } as ObjectPosition)
        }
        return missingPos
    }

    returnNewTimeSteps2(oldPo: ObjectPosition, newPo: ObjectPosition, direction: Vector3): ObjectPosition[] {
        const missingPos: ObjectPosition[] = []
        const oldVec = oldPo.position
        const newVec = newPo.position
        const diffVec = newVec.sub(oldVec)
        const oldTime = oldPo.time
        const diffTime = newPo.time - oldTime
        for (let i = 1; i < diffTime + 1; i++) {
            const addVec = diffVec.clone().multiplyScalar(i / diffTime)
            missingPos.push({
                time: oldTime + i,
                position: oldVec.clone().add(addVec),
                direction: direction.clone(),
            } as ObjectPosition)
        }
        return missingPos
    }
}
