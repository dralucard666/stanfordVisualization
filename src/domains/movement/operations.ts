import { Observable, of } from "rxjs"
import { defaultOperations } from ".."
import { Operations, simpleExecution } from "../../interpreter"
import { Primitive } from "./primitives"

function computeMoveRight(instance: Primitive): Observable<Array<Primitive>> {
    return of([instance.moveRight()])
}

function computeMoveLeft(instance: Primitive): Observable<Array<Primitive>> {
    return of([instance.moveLeft()])
}

function computeMoveUp(instance: Primitive): Observable<Array<Primitive>> {
    return of([instance.moveUp()])
}

function computeMoveDown(instance: Primitive): Observable<Array<Primitive>> {
    return of([instance.moveDown()])
}

export const operations: Operations<any> = {
    ...defaultOperations,
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
}
