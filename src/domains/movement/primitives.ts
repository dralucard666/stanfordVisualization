import { of } from "rxjs"
import { Vector3 } from "three"

export enum ObjectType {
    Pedestrian,
    Cyclist,
    Car,
}

export class Primitive {
    constructor(public position: Vector3, public type: ObjectType, public direction: Vector3) {}

    moveRight() {
        return new Primitive(this.position.clone().setX(this.position.x + 2), ObjectType.Pedestrian, this.direction)
    }
}
