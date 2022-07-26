import { of } from "rxjs"
import { Vector3 } from "three"

export enum ObjectType {
    Pedestrian,
    Cyclist,
    Car,
}

export interface ObjectPosition {
    position: Vector3
    time?: number
}

export class Primitive {
    constructor(public position: ObjectPosition[], public type: ObjectType, public direction: Vector3) {}

    moveRight() {
        const oldPo = this.position[this.position.length - 1]
        const newPosArray = structuredClone(this.position)
        newPosArray.push({
            time: 2,
            position: oldPo.position.clone().setX(oldPo.position.x + 2),
        } as ObjectPosition)
        return new Primitive(newPosArray, ObjectType.Pedestrian, this.direction)
    }
}
