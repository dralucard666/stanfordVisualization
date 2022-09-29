import Sllider from "@mui/material/Slider"
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber"
import React, { useState, useEffect } from "react"
import { CameraController } from "./camera"
import Floor from "./floor"
import MovementLogicSmallScreen from "./movementLogicSmallScreen"
import { useMovementStore } from "./useMovementStore"

export const frameRate = 60

export const CameraSmallScreen = () => {
    const { camera, gl } = useThree()
    useEffect(() => {
        camera.rotateX(-Math.PI / 10)
        camera.position.set(3, 200, 400)
        camera.rotateX(-Math.PI / 10)
    }, [camera, gl])
    return null
}

export default function Slider(props: any) {
    const data = useMovementStore((e) => e.data)
    const time = useMovementStore((e) => e.time)
    const world = useMovementStore((e) => e.world)
    const setTime = useMovementStore((e) => e.setTime)
    const min = useMovementStore((e) => e.minTime)
    const max = useMovementStore((e) => e.maxTime)
    const visible = !!data
    const [searchCanvasPos, setSearchCanvasPos] = useState<number | false>(false)
    const [smallScreenTime, setSmallScreenTime] = useState<number>(0)

    const handleChange = (event: any, newValue: any) => {
        useMovementStore.getState().setPlayActive(true)
        setTime(newValue)
        useMovementStore.getState().setPlayActive(false)
        setSearchCanvasPos(false)
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

    const onHover = (e: Event, value: any) => {
        if (e.type == "mousemove") {
            const event: MouseEvent = e as unknown as MouseEvent
            setSearchCanvasPos(event.clientX)
            setSmallScreenTime(value)
        } else {
            setSearchCanvasPos(false)
            setSmallScreenTime(0)
        }
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
                    {searchCanvasPos ? (
                        <Canvas
                            style={{
                                position: "absolute",
                                bottom: "75%",
                                zIndex: "10000",
                                marginLeft: searchCanvasPos - 220 + "px",
                                width: "500px",
                                height: "350px",
                                border: "4px solid mediumgray",
                            }}>
                            <axesHelper />
                            <Floor world={world} />(
                            <>
                                {data
                                    ? data.map((ob) => {
                                          return (
                                              <MovementLogicSmallScreen
                                                  key={ob.id}
                                                  id={ob.id}
                                                  data={ob.framePos[smallScreenTime] ?? null}
                                              />
                                          )
                                      })
                                    : null}
                            </>
                            ) <CameraSmallScreen />
                        </Canvas>
                    ) : null}
                    <div>
                        <Sllider
                            step={1}
                            min={min}
                            max={max}
                            value={time}
                            onChangeCommitted={handleChange}
                            onChange={onHover}
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
