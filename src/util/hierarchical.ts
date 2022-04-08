import { ParsedGrammarDefinition, ParsedSteps, AbstractParsedGrammarDefinition, AbstractParsedSteps } from ".."

export type HierarchicalPath = [string, ...Array<number>]
export type HierarchicalInfo = { path: HierarchicalPath }
export type HierarchicalParsedSteps = AbstractParsedSteps<HierarchicalInfo>
export type HierarchicalParsedGrammarDefinition = AbstractParsedGrammarDefinition<HierarchicalInfo>

export type TranslatedPath<I> = [AbstractParsedGrammarDefinition<I>, ...Array<AbstractParsedSteps<I>>]

export function translatePath<I>(
    grammar: AbstractParsedGrammarDefinition<I>,
    [noun, ...rest]: HierarchicalPath
): TranslatedPath<I> | undefined {
    const path: TranslatedPath<I> = [grammar, grammar[noun]]
    let current = grammar[noun]
    for (const index of rest) {
        if (current.children == null) {
            return undefined
        }
        current = current.children[index]
        path.push(current)
    }
    return path
}

export function setAtPath<I>(
    path: HierarchicalPath,
    translatedPath: TranslatedPath<I & HierarchicalInfo>,
    pathIndex: number,
    set: AbstractParsedSteps<I>
): void {
    if (pathIndex === 0) {
        const noun = path[0]
        translatedPath[0][noun] = toHierarchicalSteps(set, noun)
        return
    }
    const step = translatedPath[pathIndex] as AbstractParsedSteps<I>
    const index = path[pathIndex] as number
    step.children![index] = toHierarchicalSteps(set, ...(path.slice(0, pathIndex + 1) as HierarchicalPath))
}

export function getAtPath<I>(path: TranslatedPath<I>, pathIndex: number): AbstractParsedSteps<I> {
    if (pathIndex < 0) {
        throw new Error(`can't retrieve step at path index ${pathIndex}`)
    }
    return path[pathIndex + 1] as AbstractParsedSteps<I>
}

export function toHierarchicalSteps(steps: ParsedSteps, ...basePath: HierarchicalPath): HierarchicalParsedSteps {
    return {
        ...steps,
        path: basePath,
        children: steps.children?.map((child, i) => toHierarchicalSteps(child, ...basePath, i)) as any,
    }
}

export function toHierarchical(grammar: ParsedGrammarDefinition) {
    return Object.entries(grammar).reduce<HierarchicalParsedGrammarDefinition>(
        (prev, [name, steps]) => ({ ...prev, [name]: toHierarchicalSteps(steps, name) }),
        {}
    )
}
