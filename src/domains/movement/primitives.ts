import { of } from "rxjs"

export enum ObjectType {
    Pedestrian,
    Cyclist,
    Car,
}

export class Primitive {
    constructor(public position: THREE.Vector3, public type: ObjectType, public direction: THREE.Vector3) {}

    moveRight() {
        return new Primitive(this.position.setX(this.position.x + 2), ObjectType.Pedestrian, this.direction)
    }
}
