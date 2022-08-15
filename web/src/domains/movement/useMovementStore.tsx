import { ObjectType } from "cgv/domains/movement"
import create from "zustand"
import { ImageName } from "./floor"

// id, x , y , z, xsize, typeof
export type movObject = {
    id: number
    size: number
    type: ObjectType
    framePos: framePositions[]
    startT: number
    endT: number
    direction: number[]
}
export type framePositions = { time: number; position: number[] | null }

export interface WorldState {
    image: ImageName
    width?: number
    height?: number
}

export interface TimeState {
    time: number
    maxTime: number
    data: movObject[] | null
    world: WorldState | null
    setWorld: (newVal: WorldState) => void
    setData: (newVal: movObject[]) => void
    incrementTime: (newVal: number) => void
    setTime: (newVal: number) => void
    action: () => number
    playActive: boolean
    setPlayActive: (newBol: boolean) => void
    setMaxTime: (maxTime: number) => void
    getPlayActive: () => boolean
}

export const useMovementStore = create<TimeState>((set, get) => ({
    time: 0,
    maxTime: 0,
    data: null,
    world: null,
    setWorld: (newVal: WorldState) =>
        set((state) => {
            return { world: newVal }
        }),
    setData: (newVal: movObject[]) =>
        set((state) => {
            return { data: newVal }
        }),
    incrementTime: (newVal: number) =>
        set((state) => {
            const num: number = state.time + newVal
            return { time: num }
        }),
    setTime: (newVal: number) =>
        set((state) => {
            return { time: newVal }
        }),
    action: () => {
        return get().time
    },
    playActive: false,
    setPlayActive: (newBol: boolean) =>
        set((state) => {
            return { playActive: newBol }
        }),
    setMaxTime: (maxTime: number) =>
        set((state) => {
            return { maxTime }
        }),
    getPlayActive: () => {
        return get().playActive
    },
}))
