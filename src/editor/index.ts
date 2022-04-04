import {
    HierarchicalParsedSteps,
    ParsedSteps,
    Operations,
    AbstractParsedSymbol,
    HierarchicalInfo,
    HierarchicalParsedGrammarDefinition,
    toHierachicalSteps,
} from ".."
import { AbstractParsedParallel, AbstractParsedSequantial } from "../parser"
import { toHierachical } from "../util"
import { getDefaultChildAtIndex, StepDescriptor } from "./default-step"

export function remove<T, A>(
    at: HierarchicalParsedSteps | string,
    operations: Operations<T, A>,
    grammar: HierarchicalParsedGrammarDefinition
): void {
    //remove noun from grammar
    if (typeof at === "string") {
        delete grammar[at]
        const rootSteps = Object.values(grammar)
        if (rootSteps.length > 0) {
            for (const value of rootSteps) {
                findSymbolsWithIdentifier(value, at, (step) => remove(step, operations, grammar))
            }
        } else {
            Object.assign(grammar, { Start: toHierachicalSteps({ type: "this" }, "Start") })
        }
        return
    }

    //remove root of noun and replace with empty sequence
    if (at.childrenIndex == null) {
        replace(
            at,
            {
                type: "this",
            },
            grammar
        )
        return
    }

    switch (at.parent.type) {
        case "parallel":
        case "sequential": {
            if (at.parent.children.length != 2) {
                break
            }
            const otherChild = at.parent.children!.find((child) => child != at)
            if (otherChild == null) {
                throw new Error(
                    `unable to find more then one distinct child when removing a child from a ${at.parent.type} step`
                )
            }
            replace(at.parent, otherChild, grammar)
            return
        }
        case "symbol":
            throw new Error(`can't delete an step if it's is a symbol and has no children`)
        case "switch":
            if (at.childrenIndex > 0) {
                at.parent.cases.splice(at.childrenIndex - 1, 1)
            }
            break
        case "random":
            at.parent.probabilities.splice(at.childrenIndex, 1)
            break
        case "bracket":
            //remove parent (bracket)
            remove(at.parent, operations, grammar)
            return
    }

    const defaultChild = getDefaultChildAtIndex(at.parent, operations, at.childrenIndex)
    if (defaultChild == null) {
        at.parent.children!.splice(at.childrenIndex, 1)
        for (let i = at.childrenIndex; i < at.parent.children!.length; i++) {
            at.parent.children![i].childrenIndex! = i
        }
    } else {
        replace(at, defaultChild, grammar)
    }
}

function findSymbolsWithIdentifier(
    root: HierarchicalParsedSteps,
    identifier: string,
    onFound: (step: AbstractParsedSymbol<HierarchicalInfo>) => void
): void {
    if (root.type === "symbol" && root.identifier === identifier) {
        onFound(root)
        return
    }
    if (root.children == null) {
        return
    }
    for (const child of root.children) {
        findSymbolsWithIdentifier(child, identifier, onFound)
    }
}

export function replace(
    at: HierarchicalParsedSteps,
    step: ParsedSteps,
    grammar: HierarchicalParsedGrammarDefinition
): HierarchicalParsedSteps {
    //create new step
    const insert = toHierachicalSteps(step, at.parent, at.childrenIndex)

    //place inside parent
    if (at.childrenIndex == null) {
        grammar[at.parent] = insert
    } else {
        at.parent.children![at.childrenIndex] = insert
    }
    return insert
}

export function rename(at: string, renameWith: string, grammar: HierarchicalParsedGrammarDefinition): void {
    if (renameWith in grammar) {
        throw new Error(`can't  rename noun "${at}" into "${renameWith}" since it already exisits`)
    }
    const entry = grammar[at]
    if (entry == null) {
        throw new Error(`can't rename non exisiting noun "${at}"`)
    }
    delete grammar[at]
    grammar[renameWith] = entry
    entry.parent = renameWith
    for (const value of Object.values(grammar)) {
        findSymbolsWithIdentifier(value, at, (step) =>
            replace(
                step,
                {
                    type: "symbol",
                    identifier: renameWith,
                },
                grammar
            )
        )
    }
}

export function add(
    position: "before" | "after" | "parallel",
    at: HierarchicalParsedSteps | string,
    step: ParsedSteps,
    grammar: HierarchicalParsedGrammarDefinition
): HierarchicalParsedSteps {
    const type = position === "parallel" ? "parallel" : "sequential"
    if (typeof at === "string") {
        if (!(at in grammar)) {
            throw new Error(`noun "${at}" does not exisits`)
        }
        return add(position, grammar[at], step, grammar)
    }

    if (at.childrenIndex != null && at.parent.type === type) {
        const index = at.childrenIndex! + (position == "before" ? 0 : 1)
        const insert = toHierachicalSteps(step, at.parent, index)
        at.parent.children.splice(index, 0, insert)

        for (let i = index + 1; i < at.parent.children!.length; i++) {
            at.parent.children![i].childrenIndex! = i
        }

        return insert
    } else {
        const newParent = replace(
            at,
            {
                type,
                children: position === "before" ? [step, at] : [at, step],
            },
            grammar
        ) as AbstractParsedSequantial<HierarchicalInfo> | AbstractParsedParallel<HierarchicalInfo>
        return newParent.children[position === "before" ? 0 : 1]
    }
}

export * from "./default-step"
