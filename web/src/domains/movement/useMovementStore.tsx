import { ObjectType } from "cgv/domains/movement"
import create from "zustand"
import { ImageName } from "./floor"

// id, x , y , z, xsize, typeof
export type objectPos = [number, number, number, number, number, ObjectType]
export type framePositions = { time: number; obPositions: objectPos[] }

export interface WorldState {
    image: ImageName
    width?: number
    height?: number
}

interface TimeState {
    time: number
    data: framePositions[] | null
    currentDataLine: framePositions | null
    world: WorldState | null
    setWorld: (newVal: WorldState) => void
    setData: (newVal: framePositions[]) => void
    incrementTime: (newVal: number) => void
    setTime: (newVal: number) => void
    action: () => number
    playActive: boolean
    setPlayActive: (newBol: boolean) => void
    getPlayActive: () => boolean
}

export const useMovementStore = create<TimeState>((set, get) => ({
    time: 0,
    data: null,
    currentDataLine: null,
    world: null,
    setWorld: (newVal: WorldState) =>
    set((state) => {
      return { world: newVal };
    }),
    setData: (newVal: framePositions[]) =>
      set((state) => {
        return { data: newVal };
      }),
    incrementTime: (newVal: number) =>
      set((state) => {
        const num: number = state.time + newVal;
        const dataLine: framePositions | null = state.data? state.data[num] : null;
        return { time: num, currentDataLine: dataLine };
      }),
    setTime: (newVal: number) =>
      set((state) => {
        return { time: newVal };
      }),
    action: () => {
      return get().time;
    },
    playActive: false,
    setPlayActive: (newBol: boolean) =>
      set((state) => {
        return { playActive: newBol };
      }),
    getPlayActive: () => {
      return get().playActive;
    },
  }));
  
