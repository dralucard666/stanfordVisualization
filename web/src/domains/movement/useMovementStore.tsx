import { ObjectType } from "cgv/domains/movement"
import create from "zustand"
import simonTest from "../../../public/data/testLang.json"


// id, x , y , z, xsize, typeof
export type movObject = {
    id: string
    size: number
    type: ObjectType
    framePos: framePositions[]
    startT: number
    endT: number
    direction: number[]
}
export type framePositions = { time: number; position: number[] | null; direction: number[] | null }

export const dataWorldState: WorldState[] = [
    {
        image: "./textures/dirt/bookstore.jpg",
        width: 1424,
        height: 1088,
        name: "BookStore Empty",
        staticObjects: ['bookstore']
    },
    {
        image: "./textures/dirt/bookstore.jpg",
        width: 1424,
        height: 1088,
        name: "Simon Data",
        data: simonTest,
        staticObjects: ['simonTest']
    },
]

export interface WorldState {
    image: string
    width?: number
    height?: number
    name: string
    data?: any
    staticObjects: any[]
}

export interface TimeState {
    time: number
    maxTime: number
    minTime: number
    data: movObject[] | null
    world: WorldState
    setWorld: (newVal: WorldState) => void
    setData: (newVal: movObject[] | null) => void
    incrementTime: (newVal: number) => void
    setTime: (newVal: number) => void
    action: () => number
    playActive: boolean
    setPlayActive: (newBol: boolean) => void
    setMaxTime: (maxTime: number) => void
    setMinTime: (minTime: number) => void
    getPlayActive: () => boolean
    resetState: () => void
}

export const useMovementStore = create<TimeState>((set, get) => ({
    time: 0,
    minTime: 1000000,
    maxTime: 0,
    data: null,
    world: dataWorldState[0],
    setWorld: (newVal: WorldState) =>
        set((state) => {
            return { world: newVal }
        }),
    setData: (newVal: movObject[] | null) =>
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
    setMinTime: (minTime: number) =>
        set((state) => {
            return { minTime, time: minTime }
        }),
    getPlayActive: () => {
        return get().playActive
    },
    resetState: () => {
        set ((state) => {
            return {
                time:0,
                maxTime:0,
                minTime:1000000,
                data:null,
            }
        })
    }
}))
