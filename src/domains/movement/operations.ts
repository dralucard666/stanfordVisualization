import { Color, Vector3 } from "three"
import { Observable, of } from "rxjs"
import { defaultOperations } from ".."
import { Operations, simpleExecution } from "../../interpreter"
import { ObjectPosition, ObjectType, MovingObject } from "./primitives"
import { createPhongMaterialGenerator, PointPrimitive, Primitive } from "../shape/primitive"
import { makeTranslationMatrix } from "../shape"

export type possibleAngles = 0 | 45 | 90 | 135 | 180 | 225 | 270 | 315 | 360

export type possibleDistance = 2 | 4 | 6 | 8 | 10 | 12 | 14 | 16 | 18 | 20

function computeMoveRight(instance: MovingObject): Observable<Array<MovingObject>> {
    return of([instance.moveRight()])
}

function computeMoveLeft(instance: MovingObject): Observable<Array<MovingObject>> {
    return of([instance.moveLeft()])
}

function computeMoveUp(instance: MovingObject): Observable<Array<MovingObject>> {
    return of([instance.moveUp()])
}

function computeMoveDown(instance: MovingObject): Observable<Array<MovingObject>> {
    return of([instance.moveDown()])
}

function computeMoveRotate(
    instance: MovingObject,
    angle: possibleAngles,
    distance: possibleDistance
): Observable<Array<MovingObject>> {
    return of([instance.moveRotate(angle, distance)])
}

function createObject(
    id: number,
    position: Vector3,
    time: number,
    type: ObjectType,
    direction: Vector3
): Observable<Array<MovingObject>> {
    return of([new MovingObject(id, [{ position, time } as ObjectPosition], ObjectType.Pedestrian, direction)])
}

function computePoint3(x: number, y: number, z: number): Observable<Array<Vector3>> {
    return of([new Vector3(x, y, z)])
}

export const operations: Operations<any> = {
    ...defaultOperations,
    createOb: {
        execute: simpleExecution<any>(createObject),
        includeThis: false,
        defaultParameters: [
            () => ({ type: "raw", value: 0 }),
            () => ({
                type: "operation",
                identifier: "point3",
                children: [
                    { type: "raw", value: 0 },
                    { type: "raw", value: 0 },
                    { type: "raw", value: 0 },
                ],
            }),
            () => ({ type: "raw", value: 0 }),
            () => ({ type: "raw", value: 0 }),
            () => ({
                type: "operation",
                identifier: "point3",
                children: [
                    { type: "raw", value: 1 },
                    { type: "raw", value: 0 },
                    { type: "raw", value: 0 },
                ],
            }),
        ],
    },
    point3: {
        execute: simpleExecution<any>(computePoint3),
        includeThis: false,
        defaultParameters: [
            () => ({ type: "raw", value: 0 }),
            () => ({ type: "raw", value: 0 }),
            () => ({ type: "raw", value: 0 }),
        ],
    },
    moveRight: {
        execute: simpleExecution<any>(computeMoveRight),
        includeThis: true,
        defaultParameters: [],
    },
    moveLeft: {
        execute: simpleExecution<any>(computeMoveLeft),
        includeThis: true,
        defaultParameters: [],
    },
    moveUp: {
        execute: simpleExecution<any>(computeMoveUp),
        includeThis: true,
        defaultParameters: [],
    },
    moveDown: {
        execute: simpleExecution<any>(computeMoveDown),
        includeThis: true,
        defaultParameters: [],
    },
    moveRotate: {
        execute: simpleExecution<any>(computeMoveRotate),
        includeThis: true,
        defaultParameters: [() => ({ type: "raw", value: 0 }), () => ({ type: "raw", value: 100 })],
    },
}
