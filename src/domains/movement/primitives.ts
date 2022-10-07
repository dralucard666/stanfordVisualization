import { of } from "rxjs"
import { Vector3 } from "three"
import { possibleAngles, possibleDistance } from "./operations"

export enum ObjectType {
    Pedestrian,
    Cyclist,
    Car,
}

export const standardTime = 15

export interface ObjectPosition {
    position: Vector3
    time: number
    direction: Vector3
}

export class Primitive {
    constructor(public staticObjects: any[]) {}

    createPrimitive(position: Vector3, time: number, direction: Vector3, type: ObjectType) {
        return new MovingObject([{ position, time, direction } as ObjectPosition], type, this.staticObjects)
    }
}

export class MovingObject extends Primitive {
    constructor(public position: ObjectPosition[], public type: ObjectType, public staticObjects: any[]) {
        super(staticObjects)
    }

    moveRight(distance: number) {
        const oldPo = this.position[this.position.length - 1]
        const newPo = {
            position: oldPo.position.clone().setX(oldPo.position.x + distance),
            time: oldPo.time + standardTime,
        } as ObjectPosition

        const newTimeSteps = this.returnNewTimeSteps(oldPo, newPo, new Vector3(1, 0, 0))
        const newPosArray = structuredClone(this.position)
        newPosArray.push(...newTimeSteps)
        return new MovingObject(newPosArray, this.type, this.staticObjects)
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
        return new MovingObject(newPosArray, this.type, this.staticObjects)
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
        return new MovingObject(newPosArray, this.type, this.staticObjects)
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
        return new MovingObject(newPosArray, this.type, this.staticObjects)
    }

    moveRotate(angle: possibleAngles, distance: possibleDistance) {
        const oldPo = this.position[this.position.length - 1]
        const direction = this.position[this.position.length - 1].direction
        const newDirection = direction.applyAxisAngle(new Vector3(0, 1, 0), (-angle / 180) * Math.PI)
        const newPo = {
            position: oldPo.position.clone().add(newDirection.multiplyScalar(distance)),
            time: oldPo.time + standardTime,
        } as ObjectPosition
        const newTimeSteps = this.returnNewTimeSteps2(oldPo, newPo, newDirection.normalize())
        const newPosArray = structuredClone(this.position)
        newPosArray.push(...newTimeSteps)
        return new MovingObject(newPosArray, this.type, this.staticObjects)
    }

    standStill() {
        const oldPo = this.position[this.position.length - 1]
        const oldTime = oldPo.time
        const newPosArray = structuredClone(this.position)
        for (let time = oldTime + 1; time < oldTime + 1 + standardTime; time++) {
            const newEntry = { ...oldPo, time } as ObjectPosition
            newPosArray.push(newEntry)
        }
        return new MovingObject(newPosArray, this.type, this.staticObjects)
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

    staticObjectAhead() {
        const staticOb = new Vector3(12, -5, 0)
        const staticOb2 = new Vector3(12, 5, 0)
        const obPos = this.position[this.position.length - 1].position
        const direction = this.position[this.position.length - 1].direction.multiplyScalar(10)
        const futureObPos = new Vector3(0, 0, 0).addVectors(obPos, direction)
        return new Vector3(0, 0, 0).subVectors(obPos, staticOb)
    }
}

function ccw(A: Vector3, B: Vector3, C: Vector3) {
    return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x)
}

// Return true if line segments AB and CD intersect
function intersect(A: Vector3, B: Vector3, C: Vector3, D: Vector3) {
    return ccw(A, C, D) != ccw(B, C, D) && ccw(A, B, C) != ccw(A, B, D)
}
