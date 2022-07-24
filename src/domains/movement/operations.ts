import { Observable, of } from "rxjs"
import { defaultOperations } from ".."
import { Operations, simpleExecution } from "../../interpreter"
import { Primitive } from "./primitives"

function computeMoveRight(instance: Primitive): Observable<Array<Primitive>> {
    return of([instance.moveRight()])
}

export const operations: Operations<any> = {
    ...defaultOperations,
    moveRight: {
        execute: simpleExecution<any>(computeMoveRight),
        includeThis: true,
        defaultParameters: [],
    },
}
