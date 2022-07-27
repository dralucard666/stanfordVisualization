import { of } from "rxjs"
import { Vector3 } from "three"

export enum ObjectType {
    Pedestrian,
    Cyclist,
    Car,
}

const standardTime = 10

export interface ObjectPosition {
    position: Vector3
    time: number
}

export class Primitive {
    constructor(public position: ObjectPosition[], public type: ObjectType, public direction: Vector3) {}

    moveRight() {
        const oldPo = this.position[this.position.length - 1]
        const newPo = {
            position: oldPo.position.clone().setX(oldPo.position.x + 10),
            time: oldPo.time + standardTime,
        } as ObjectPosition

        const newTimeSteps = this.returnNewTimeSteps(oldPo, newPo)
        const newPosArray = structuredClone(this.position)
        newPosArray.push(...newTimeSteps)
        return new Primitive(newPosArray, ObjectType.Pedestrian, this.direction)
    }

    moveLeft() {
        const oldPo = this.position[this.position.length - 1]
        const newPo = {
            position: oldPo.position.clone().setX(oldPo.position.x - 10),
            time: oldPo.time + standardTime,
        } as ObjectPosition

        const newTimeSteps = this.returnNewTimeSteps(oldPo, newPo)
        const newPosArray = structuredClone(this.position)
        newPosArray.push(...newTimeSteps)
        return new Primitive(newPosArray, ObjectType.Pedestrian, this.direction)
    }

    moveUp() {
        const oldPo = this.position[this.position.length - 1]
        const newPo = {
            position: oldPo.position.clone().setZ(oldPo.position.z + 10),
            time: oldPo.time + standardTime,
        } as ObjectPosition

        const newTimeSteps = this.returnNewTimeSteps(oldPo, newPo)
        const newPosArray = structuredClone(this.position)
        newPosArray.push(...newTimeSteps)
        return new Primitive(newPosArray, ObjectType.Pedestrian, this.direction)
    }

    moveDown() {
        const oldPo = this.position[this.position.length - 1]
        const newPo = {
            position: oldPo.position.clone().setZ(oldPo.position.z + 10),
            time: oldPo.time + standardTime,
        } as ObjectPosition

        const newTimeSteps = this.returnNewTimeSteps(oldPo, newPo)
        const newPosArray = structuredClone(this.position)
        newPosArray.push(...newTimeSteps)
        return new Primitive(newPosArray, ObjectType.Pedestrian, this.direction)
    }

    returnNewTimeSteps(oldPo: ObjectPosition, newPo: ObjectPosition): ObjectPosition[] {
        const missingPos: ObjectPosition[] = []
        const oldVec = oldPo.position
        const newVec = newPo.position
        const diffVec = newVec.sub(oldVec)
        const oldTime = oldPo.time
        const diffTime = newPo.time - oldTime
        for (let i = 1; i < diffTime + 1; i++) {
            const addVec = diffVec.clone().multiplyScalar(i / diffTime)
            missingPos.push({ time: oldTime + i, position: oldVec.clone().add(addVec) } as ObjectPosition)
        }
        return missingPos
    }
}
