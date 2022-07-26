import Sllider from "@mui/material/Slider"
import { extend, useFrame } from "@react-three/fiber"
import React, { useState, useEffect } from "react"
import { useMovementStore } from "./useMovementStore"

export const frameRate = 60

export default function Slider(props: any) {
    const [time, setTime] = useState(0)

    useEffect(() => {
        useMovementStore.subscribe((e) => setTime(e.time))
    })

    const handleChange = (event: any, newValue: any) => {
        useMovementStore.getState().setPlayActive(false)
        useMovementStore.getState().setTime(newValue)
    }

    const play = () => {
        useMovementStore.getState().setPlayActive(true)
    }

    const pause = () => {
        useMovementStore.getState().setPlayActive(false)
    }

    const reset = () => {
        useMovementStore.getState().setPlayActive(false)
        useMovementStore.getState().setTime(0)
    }

    return (
        <>
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
                        min={0}
                        max={100}
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
        </>
    )
}
