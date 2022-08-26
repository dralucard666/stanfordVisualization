import { Color, Vector3 } from "three"
import { Observable, of } from "rxjs"
import { defaultOperations } from ".."
import { Operations, simpleExecution } from "../../interpreter"
import { ObjectPosition, ObjectType, MovingObject, Primitive } from "./primitives"
import { createPhongMaterialGenerator, PointPrimitive } from "../shape/primitive"
import { makeTranslationMatrix } from "../shape"

export type possibleAngles = 0 | 45 | 90 | 135 | 180 | 225 | 270 | 315 | 360

export type possibleDistance = 2 | 4 | 6 | 8 | 10 | 12 | 14 | 16 | 18 | 20

function computeMoveRight(instance: MovingObject, distance: number): Observable<Array<MovingObject>> {
    return of([instance.moveRight(distance)])
}

function computeMoveLeft(instance: MovingObject, distance: number): Observable<Array<MovingObject>> {
    return of([instance.moveLeft(distance)])
}

function computeMoveUp(instance: MovingObject, distance: number): Observable<Array<MovingObject>> {
    return of([instance.moveUp(distance)])
}

function computeMoveDown(instance: MovingObject, distance: number): Observable<Array<MovingObject>> {
    return of([instance.moveDown(distance)])
}

function computeMoveRotate(
    instance: MovingObject,
    angle: possibleAngles,
    distance: possibleDistance
): Observable<Array<MovingObject>> {
    return of([instance.moveRotate(angle, distance)])
}

function computeStandStill(instance: MovingObject): Observable<Array<MovingObject>> {
    return of([instance.standStill()])
}

function createObject(
    instance: Primitive,
    position: Vector3,
    time: number,
    type: ObjectType,
    direction: Vector3
): Observable<Array<MovingObject>> {
    return of([instance.createPrimitive(position, time, direction, type)])
}

function computePoint3(x: number, y: number, z: number): Observable<Array<Vector3>> {
    return of([new Vector3(x, y, z)])
}

export const operations: Operations<any> = {
    ...defaultOperations,
    createOb: {
        execute: simpleExecution<any>(createObject),
        includeThis: true,
        defaultParameters: [
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
        defaultParameters: [() => ({ type: "raw", value: 100 })],
    },
    moveLeft: {
        execute: simpleExecution<any>(computeMoveLeft),
        includeThis: true,
        defaultParameters: [() => ({ type: "raw", value: 100 })],
    },
    moveUp: {
        execute: simpleExecution<any>(computeMoveUp),
        includeThis: true,
        defaultParameters: [() => ({ type: "raw", value: 100 })],
    },
    moveDown: {
        execute: simpleExecution<any>(computeMoveDown),
        includeThis: true,
        defaultParameters: [() => ({ type: "raw", value: 100 })],
    },
    moveRotate: {
        execute: simpleExecution<any>(computeMoveRotate),
        includeThis: true,
        defaultParameters: [() => ({ type: "raw", value: 0 }), () => ({ type: "raw", value: 100 })],
    },
    standStill: {
        execute: simpleExecution<any>(computeStandStill),
        includeThis: true,
        defaultParameters: [],
    },
}
