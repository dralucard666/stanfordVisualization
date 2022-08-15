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
}

export class MovingObject {
    constructor(
        public id: number,
        public position: ObjectPosition[],
        public type: ObjectType,
        public direction: Vector3
    ) {}

    moveRight() {
        const oldPo = this.position[this.position.length - 1]
        const newPo = {
            position: oldPo.position.clone().setX(oldPo.position.x + 100),
            time: oldPo.time + standardTime,
        } as ObjectPosition

        const newTimeSteps = this.returnNewTimeSteps(oldPo, newPo)
        const newPosArray = structuredClone(this.position)
        newPosArray.push(...newTimeSteps)
        return new MovingObject(this.id, newPosArray, this.type, new Vector3(1, 0, 0))
    }

    moveLeft() {
        const oldPo = this.position[this.position.length - 1]
        const newPo = {
            position: oldPo.position.clone().setX(oldPo.position.x - 100),
            time: oldPo.time + standardTime,
        } as ObjectPosition

        const newTimeSteps = this.returnNewTimeSteps(oldPo, newPo)
        const newPosArray = structuredClone(this.position)
        newPosArray.push(...newTimeSteps)
        return new MovingObject(this.id, newPosArray, this.type, new Vector3(-1, 0, 0))
    }

    moveUp() {
        const oldPo = this.position[this.position.length - 1]
        const newPo = {
            position: oldPo.position.clone().setZ(oldPo.position.z + 100),
            time: oldPo.time + standardTime,
        } as ObjectPosition

        const newTimeSteps = this.returnNewTimeSteps(oldPo, newPo)
        const newPosArray = structuredClone(this.position)
        newPosArray.push(...newTimeSteps)
        return new MovingObject(this.id, newPosArray, this.type, new Vector3(0, 0, 1))
    }

    moveDown() {
        const oldPo = this.position[this.position.length - 1]
        const newPo = {
            position: oldPo.position.clone().setZ(oldPo.position.z - 100),
            time: oldPo.time + standardTime,
        } as ObjectPosition

        const newTimeSteps = this.returnNewTimeSteps(oldPo, newPo)
        const newPosArray = structuredClone(this.position)
        newPosArray.push(...newTimeSteps)
        return new MovingObject(this.id, newPosArray, this.type, new Vector3(0, 0, -1))
    }

    moveRotate(angle: possibleAngles, distance: possibleDistance) {
        const oldPo = this.position[this.position.length - 1]
        const newDirection = this.direction.applyAxisAngle(new Vector3(0, 1, 0), angle)
        const newPo = {
            position: oldPo.position.clone().add(newDirection.multiplyScalar(distance)),
            time: oldPo.time + standardTime,
        } as ObjectPosition
        const newTimeSteps = this.returnNewTimeSteps(oldPo, newPo)
        const newPosArray = structuredClone(this.position)
        newPosArray.push(...newTimeSteps)
        console.log(newDirection)
        return new MovingObject(this.id, newPosArray, this.type, newDirection.normalize())
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
