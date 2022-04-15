import { Value } from "../interpreter"
import { ParsedSteps } from "../parser"

export type InterpretedInfo = {
    values?: Array<Value<any, any>>
}

export function translateSelectionsForStep(
    allIndices: Array<string>,
    selectedIndices: Array<string>,
    newSteps: ParsedSteps,
    oldSteps: ParsedSteps
): ParsedSteps {
    if (selectedIndices.length === allIndices.length) {
        return newSteps
    }

    return {
        type: "if",
        children: [toCondition(selectedIndices, allIndices), newSteps, oldSteps],
    }
}

function toCondition(selectedIndices: Array<string>, allIndices: Array<string>): ParsedSteps {
    //TODO: detect more advanced patterns and use different condition

    if (selectedIndices.length > allIndices.length * 0.5) {
        return toAndUnequalCondition(selectedIndices, allIndices) ?? { type: "raw", value: false }
    }

    return toOrEqualCondition(selectedIndices)
}

function toAndUnequalCondition(selectedIndices: Array<string>, allIndices: Array<string>): ParsedSteps | undefined {
    if (selectedIndices.length === 0) {
        return undefined
    }
    const restCondition = toAndUnequalCondition(selectedIndices.slice(1), allIndices)
    const key = selectedIndices.join(",")
    const firstCondition: ParsedSteps | undefined = allIndices.includes(key)
        ? undefined
        : {
              type: "unequal",
              children: [
                  { type: "operation", children: [], identifier: "id" },
                  { type: "raw", value: selectedIndices[0] },
              ],
          }

    if (restCondition == null) {
        return firstCondition
    }

    if (firstCondition == null) {
        return restCondition
    }

    return {
        type: "and",
        children: [firstCondition, restCondition],
    }
}

function toOrEqualCondition(index: Array<string>): ParsedSteps {
    if (index.length === 0) {
        return { type: "raw", value: false }
    }
    const firstCondition: ParsedSteps = {
        type: "equal",
        children: [
            { type: "operation", children: [], identifier: "id" },
            { type: "raw", value: index[0] },
        ],
    }
    if (index.length === 1) {
        return firstCondition
    }
    return {
        type: "or",
        children: [firstCondition, toOrEqualCondition(index.slice(1))],
    }
}
