import Sllider from "@mui/material/Slider"
import { extend, useFrame } from "@react-three/fiber"
import React, { useState, useEffect } from "react"
import { useMovementStore } from "./useMovementStore"

export const frameRate = 60

interface SliderState {
    time: number
    visible: boolean
    min: number
    max: number
}

export default function Slider(props: any) {
    const data = useMovementStore((e) => e.data)
    const time = useMovementStore((e) => e.time)
    const setTime = useMovementStore((e) => e.setTime)
    const min = data ? data[0].time : 0
    const max = useMovementStore((e) => e.maxTime)
    const visible = !!data

    const handleChange = (event: any, newValue: any) => {
        useMovementStore.getState().setPlayActive(false)
        setTime(newValue)
    }

    const play = () => {
        useMovementStore.getState().setPlayActive(true)
    }

    const pause = () => {
        useMovementStore.getState().setPlayActive(false)
    }

    const reset = () => {
        useMovementStore.getState().setPlayActive(false)
        setTime(0)
    }

    return (
        <>
            {visible ? (
                <div
                    style={{
                        position: "absolute",
                        top: "80%",
                        zIndex: "10000",
                        marginLeft: "10%",
                        marginRight: "10%",
                        width: "80%",
                        height: "5%",
                        color: "white",
                    }}>
                    Time : {time}
                    <div>
                        <Sllider
                            step={1}
                            min={min}
                            max={max}
                            value={time}
                            onChangeCommitted={handleChange}
                            valueLabelDisplay="auto"
                        />
                        <div className="d-flex justify-content-between">
                            <button onClick={play}>Play</button>
                            <button onClick={pause}>Pause</button>
                            <button onClick={reset}>Reset</button>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    )
}
