import {
    HierarchicalParsedSteps,
    HierarchicalParsedGrammarDefinition,
    replace,
    Operations,
    ParsedSteps,
    parse,
    serializeString,
    ParsedGrammarDefinition,
    toHierarchical,
    toHierarchicalSteps,
    insert,
    removeStep,
    removeValue,
    editSelection,
    editIndex,
    SelectionsMap,
    unselectAll,
} from "cgv"
import produce, { Draft } from "immer"
import create, { GetState, SetState } from "zustand"
import { combine, subscribeWithSelector } from "zustand/middleware"
import { UseBaseStore } from "./global"

export type BaseState = CombineEmpty<GuiState, TuiState> | CombineEmpty<TuiState, GuiState>

export type CombineEmpty<T, K> = T & {
    [Key in Exclude<keyof K, keyof T>]?: undefined
}

export type GuiState = {
    type: "gui"
    selectionsMap: SelectionsMap
    hovered: Array<HierarchicalParsedSteps | string>
    grammar: HierarchicalParsedGrammarDefinition
    requested: { type: string; fulfill: (value: any) => void } | undefined
}

export type TuiState =
    | CombineEmpty<TuiCorrectState, TuiIncorrectState>
    | CombineEmpty<TuiIncorrectState, TuiCorrectState>

export type TuiCorrectState = {
    type: "tui"
    text: string
    correct: true
    grammar: ParsedGrammarDefinition
}

export type TuiIncorrectState = {
    type: "tui"
    text: string
    correct: false
    error: string
}

export function createBaseState(operations: Operations<any, any>) {
    return create(
        subscribeWithSelector(combine(createBaseStateInitial(), createBaseStateFunctions.bind(null, operations)))
    ) as UseBaseStore
}

function createBaseStateInitial(): BaseState {
    return {
        type: "gui",
        selectionsMap: {},
        hovered: [],
        grammar: toHierarchical({
            Start: { type: "this" },
        }),
        requested: undefined,
    }
}

function createBaseStateFunctions(
    operations: Operations<any, any>,
    set: SetState<BaseState>,
    get: GetState<BaseState>
) {
    return {
        setText: (text: string) => {
            const state = get()
            if (state.type != "tui") {
                return
            }
            try {
                const grammar = parse(text)
                set({ text, correct: true, grammar })
            } catch (error: any) {
                set({ text, correct: false, error: error.message })
            }
        },
        setType: (type: "gui" | "tui") => {
            const state = get()
            if (state.type === type) {
                return
            }
            if (state.type === "tui" && state.correct) {
                set({
                    type: "gui",
                    grammar: toHierarchical(state.grammar),
                    selectionsMap: {},
                    hovered: [],
                    requested: undefined,
                })
                return
            }
            if (state.type === "gui") {
                set({
                    type: "tui",
                    grammar: state.grammar,
                    text: serializeString(state.grammar),
                    correct: true,
                })
                return
            }
        },
        onStartHover: (step: HierarchicalParsedSteps | string) => {
            const state = get()
            if (state.type != "gui") {
                return
            }
            if (!state.hovered.includes(step)) {
                set({ hovered: [...state.hovered, step] })
            }
        },
        onEndHover: (step: HierarchicalParsedSteps | string) => {
            const state = get()
            if (state.type != "gui") {
                return
            }
            set({ ...state, hovered: state.hovered.filter((hoveredStep) => hoveredStep != step) })
        },
        editIndex: (steps: HierarchicalParsedSteps, index: Array<number>, add: boolean) => {
            const state = get()
            if (state.type != "gui") {
                return
            }
            set({ selectionsMap: editIndex(state.selectionsMap, steps, index, add) })
        },
        select: (
            steps: HierarchicalParsedSteps,
            index: Array<number> | undefined,
            type: "replace" | "add" | "remove" | "toggle"
        ) => {
            const state = get()
            if (state.type != "gui") {
                return
            }
            set({ selectionsMap: editSelection(state.selectionsMap, steps, index, type) })
        },
        unselectAll: () => {
            const state = get()
            if (state.type != "gui") {
                return
            }
            set({ selectionsMap: unselectAll(state.selectionsMap) })
        },
        escape: () => {
            const state = get()
            if (state.type != "gui") {
                return
            }
            if (state.requested != null) {
                set({ requested: undefined })
                return
            }
            set({ selectionsMap: unselectAll(state.selectionsMap) })
        },
        request: (type: string, fulfill: (value: any) => void) => {
            const state = get()
            if (state.type != "gui") {
                return
            }
            set({
                requested: {
                    type,
                    fulfill: (value) => {
                        fulfill(value)
                        const state = get()
                        if (state.type === "gui" && state.requested != null) {
                            set({ ...state, requested: undefined })
                        }
                    },
                },
            })
        },
        cancelRequest: () => {
            const state = get()
            if (state.type != "gui") {
                return
            }
            set({ requested: undefined })
        },
        createNoun: (name: string) => {
            const state = get()
            if (state.type != "gui") {
                return
            }
            set({
                grammar: { ...state.grammar, [name]: toHierarchicalSteps({ type: "this" }, name) },
            })
        },
        insert: (type: "before" | "after" | "parallel", stepGenerator: () => ParsedSteps) => {
            const state = get()
            if (state.type != "gui") {
                return
            }

            set(insert(type, state.selectionsMap, stepGenerator, state.grammar))
        },
        removeStep: () => {
            const state = get()
            if (state.type != "gui") {
                return
            }
            set(removeStep(state.selectionsMap, operations, state.grammar))
        },
        removeValue: () => {
            const state = get()
            if (state.type != "gui") {
                return
            }
            set(removeValue(state.selectionsMap, state.grammar))
        },
        rename: (name: string) => {
            /*const state = get()
            if (state.type != "gui" || state.selections.length <= 0) {
                return
            }
            if (state.selections.length > 1) {
                return
            }
            const selection = state.selections[0]
            if (Array.isArray(selection.path) && selection.path.length > 1) {
                return
            }

            set(renameNoun(Array.isArray(selection.path) ? selection.path[0] : selection.path, name, state.grammar))*/
        },
        replace: <Type extends ParsedSteps["type"]>(
            replaceWith: (steps: Draft<ParsedSteps & { type: Type }>) => Draft<ParsedSteps> | void
        ) => {
            const state = get()
            if (state.type != "gui") {
                return
            }
            set(replace(state.selectionsMap, replaceWith as any, state.grammar))
        },
    }
}

export type BaseStateFunctions = ReturnType<typeof createBaseStateFunctions>

export type BaseStore = BaseState & BaseStateFunctions
