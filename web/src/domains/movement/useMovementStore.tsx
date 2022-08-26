import { ObjectType } from "cgv/domains/movement"
import create from "zustand"
import bookStoreData from "../../../public/data/bookstore0Lang.json"
import coupaData from "../../../public/data/coupa0Lang.json"
import deathCircleData from "../../../public/data/deathCircle0Lang.json"
import gatesData from "../../../public/data/gates0Lang.json"
import hyangData from "../../../public/data/hyang0Lang.json"
import littleData from "../../../public/data/little0Lang.json"
import nexusData from "../../../public/data/nexus0Lang.json"
import quadData from "../../../public/data/quad0Lang.json"


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
        name: "BookStore Empty"
    },
    {
        image: "./textures/dirt/bookstore.jpg",
        width: 1424,
        height: 1088,
        name: "BookStore With Data",
        data: bookStoreData,
    },
    {
        image: "./textures/dirt/coupa.jpg",
        width: 1980,
        height: 1093,
        name: "Coupa",
        data: coupaData,
    },
    {
        image: "./textures/dirt/deathCircle.jpg",
        width: 1630,
        height: 1948,
        name: "DeathCircle",
        data: deathCircleData,
    },
    {
        image: "./textures/dirt/gates.jpg",
        width: 1325,
        height: 1973,
        name: "Gates",
        data: gatesData,
    },
    {
        image: "./textures/dirt/hyang.jpg",
        width: 1455,
        height: 1925,
        name: "Hyan",
        data: hyangData,
    },
    {
        image: "./textures/dirt/little.jpg",
        width: 1417,
        height: 2019,
        name: "Little",
        data: littleData,
    },
    {
        image: "./textures/dirt/nexus.jpg",
        width: 1330,
        height: 1947,
        name: "Nexus",
        data: nexusData,
    },
    {
        image: "./textures/dirt/quad.jpg",
        width: 1983,
        height: 1088,
        name: "Quad",
        data: quadData,
    },
]

export interface WorldState {
    image: string
    width?: number
    height?: number
    name: string
    data?: any
}

export interface TimeState {
    time: number
    maxTime: number
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
    getPlayActive: () => boolean
}

export const useMovementStore = create<TimeState>((set, get) => ({
    time: 0,
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
    getPlayActive: () => {
        return get().playActive
    },
}))
