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
        image: "./models/bookstore.glb",
        width: 1424,
        height: 1088,
        scale: [260, 280, 310],
        position: [-20, 0, -20],
        name: "BookStore Empty",
        staticObjects: ["bookstore"],
    },
    {
        image: "./models/bookstore.glb",
        width: 1424,
        height: 1088,
        scale: [260, 280, 310],
        position: [-20, 0, -20],
        name: "Simon Bookstore",
        data: simonTest,
        staticObjects: ["simonTest"],
    },
    {
        image: "./models/eth.glb",
        width: 640,
        height: 480,
        scale: [280, 280, 280],
        position: [0, -192, -20],
        name: "Simon ETH",
        data: simonTest,
        staticObjects: ["simonTest"],
    },
    {
        image: "./models/hotel.glb",
        width: 720,
        height: 576,
        scale: [280, 280, 280],
        position: [0, 4, -20],
        name: "Simon HOTEL",
        data: simonTest,
        staticObjects: ["simonTest"],
    },
    {
        image: "./models/little.glb",
        width: 1417,
        height: 2019,
        scale: [280, 280, 280],
        position: [0, -9, -20],
        name: "Simon LITTLE",
        data: simonTest,
        staticObjects: ["simonTest"],
    },
    {
        image: "./models/students.glb",
        width: 720,
        height: 576,
        scale: [280, 280, 280],
        position: [0, 4, -20],
        name: "Simon STUDENTS",
        data: simonTest,
        staticObjects: ["simonTest"],
    },
    {
        image: "./models/zara.glb",
        width: 720,
        height: 576,
        scale: [280, 280, 280],
        position: [0, 4, -20],
        name: "Simon ZARA",
        data: simonTest,
        staticObjects: ["simonTest"],
    },
]

export interface WorldState {
    image: string
    width: number
    height: number
    position?: [number, number, number]
    scale?: [number, number, number]
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
        set((state) => {
            return {
                time: 0,
                maxTime: 0,
                minTime: 1000000,
                data: null,
            }
        })
    },
}))
