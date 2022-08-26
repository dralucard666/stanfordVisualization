import { useContextBridge } from "@react-three/drei"
import { Canvas, events, useFrame } from "@react-three/fiber"
import { tileZoomRatio } from "cgv/domains/shape"
import { operations } from "cgv/domains/movement/operations"
import Head from "next/head"
import React, { HTMLProps, Suspense, useState } from "react"
import { Texture } from "three"
import { createBaseState } from "../src/base-state"
import { CameraController } from "../src/domains/movement/camera"
import Floor from "../src/domains/movement/floor"
import {
    DownloadButton,
    FlyCameraButton,
    MultiSelectButton,
    onDrop,
    ShowError,
    SummarizeButton,
} from "../src/domains/shape"
import { useViewerState } from "../src/domains/shape/viewer/state"
import { Editor } from "../src/editor"
import { domainContext, DomainProvider, UseBaseStore, useBaseStore } from "../src/global"
import { TextEditorToggle } from "../src/gui/toggles/text"
import {
    AbstractParsedSequantial,
    allPatternType,
    idPatternType,
    indexGreaterEqualPatternType,
    indexModuloPatternType,
    indexPatternType,
    indexSmallerEqualPatternType,
    ParsedSteps,
} from "cgv"
import { Descriptions } from "../src/domains/movement/description"
import { DescriptionList } from "../src/gui/description-list"
import { GUI } from "../src/gui"
import { dataWorldState, useMovementStore, WorldState } from "../src/domains/movement/useMovementStore"
import Slider from "../src/domains/movement/slider"
import { Person } from "../src/domains/movement/personGltf"
import shallow from "zustand/shallow"

const zoom = 18
const globalLocalRatio = tileZoomRatio(0, zoom)

// id, posX, posY, posZ, size, time, startPos, type, [commands]

export default function Movement() {
    return (
        <>
            <Head>
                <title>CGV | Shape Editorrrrrrrrrrrrrrrrr</title>
                <meta name="description" content=""></meta>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <DomainProvider
                store={createBaseState(operations, [
                    allPatternType,
                    indexPatternType,
                    indexModuloPatternType,
                    indexGreaterEqualPatternType,
                    indexSmallerEqualPatternType,
                    idPatternType,
                ])}
                Viewer={Viewer}
                operationGuiMap={{}}
                operations={operations}>
                <Editor />
            </DomainProvider>
        </>
    )
}

const Persons = () => {
    const data = useMovementStore((store) => store.data)
    // const playActive = useMovementStore((store) => store.playActive)
    return (
        <>
            {data
                ? data.map((ob) => {
                      return <Person key={ob.id} id={ob.id} data={ob} />
                  })
                : null}
        </>
    )
}

export function Viewer({ className, children, ...rest }: HTMLProps<HTMLDivElement>) {
    const Bridge = useContextBridge(domainContext)
    const store = useBaseStore()
    const [texture, setTexture] = useState<Texture>()
    const world = useMovementStore((e) => e.world)
    const setWorldState = useMovementStore((e) => e.setWorld)

    const selectWorld = (store: UseBaseStore, newVal: any) => {
        const selectedData = dataWorldState[newVal]
        console.log('nix')
        if (selectedData.data) {
            for (const dataLine of selectedData.data) {
                const lineId = ("ID" + dataLine[0]) as string
                const lineX = dataLine[1] as number
                const lineZ = dataLine[2] as number
                const lineY = dataLine[3] as number
                const lineSize = dataLine[4] as number
                const lineTime = dataLine[5] as number
                const lineStartDir = dataLine[6] as number[]
                const lineType = dataLine[7] as string
                const lineCommands = dataLine[8] as any[]
                const width = selectedData.width
                const height = selectedData.height
                const syntaxData = sequentialSyntaxTree(
                    lineId,
                    lineX,
                    lineZ,
                    lineY,
                    lineTime,
                    lineStartDir,
                    lineCommands,
                    width ?? 0,
                    height ?? 0
                )
                store.getState().addDescriptions(syntaxData)
            }
        }
        setWorldState(selectedData)
        console.log(selectedData)
        console.log(world)
        return
    }

    return (
        <Suspense fallback={null}>
            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop.bind(null, store)}
                {...rest}
                className={`${className} position-relative`}>
                <Canvas
                    style={{
                        touchAction: "none",
                        userSelect: "none",
                        WebkitUserSelect: "none",
                    }}
                    events={(store) => ({
                        ...events(store),
                        priority: 1,
                        filter: (intersections) => {
                            if (useViewerState.getState().controlling) {
                                return []
                            }
                            return intersections.sort((a, b) => a.distance - b.distance)
                        },
                    })}
                    dpr={global.window == null ? 1 : window.devicePixelRatio}>
                    <Bridge>
                        <axesHelper />
                        <Descriptions />
                        <Floor world={world} />
                        <Clock />
                        <CameraController />
                    </Bridge>
                    <Persons />
                </Canvas>
                <Slider />
                <div
                    className="d-flex flex-row justify-content-between position-absolute"
                    style={{
                        pointerEvents: "none",
                        inset: 0,
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                    }}>
                    <div className="d-flex flex-column my-3 ms-3" style={{ maxWidth: 200 }}>
                        <DescriptionList
                            createDescriptionRequestData={() => ({})}
                            style={{ pointerEvents: "all" }}
                            className="mb-3">
                            <div className="p-2 border-top border-1">
                                <SummarizeButton />
                            </div>
                            <div className="w-100 mt-2">Select Data</div>
                            <select
                                value={world.name}
                                onChange={(e) => {
                                    selectWorld(store, e.target.value) // See Issue 2 below
                                }}
                                className="form-select">
                                {dataWorldState.map((worldState, index) => (
                                    <option value={index} key={worldState.name}>
                                        {worldState.name}
                                    </option>
                                ))}
                            </select>
                        </DescriptionList>
                        <div className="flex-grow-1" />
                        <div style={{ pointerEvents: "all" }} className="d-flex flex-row">
                            <MultiSelectButton className="me-2" />
                            {/*<SpeedSelection className="me-2" />*/}
                            <DownloadButton className="me-2" />
                            <FlyCameraButton className="me-2" />
                            <ShowError />
                        </div>
                    </div>
                    <div className="d-flex flex-column align-items-end m-3">
                        <GUI
                            className="bg-light border rounded shadow w-100 mb-3 overflow-hidden"
                            style={{
                                maxWidth: "16rem",
                                pointerEvents: "all",
                            }}
                        />
                        <div className="flex-grow-1"></div>
                        <div className="d-flex flex-row" style={{ pointerEvents: "all" }}>
                            <TextEditorToggle className="me-2" />
                            {/*<FullscreenToggle rootRef={null} />*/}
                        </div>
                    </div>
                </div>
                {children}
            </div>
        </Suspense>
    )
}

const Clock = () => {
    const data = useMovementStore((e) => e.data)
    const maxTime = useMovementStore((e) => e.maxTime)

    useFrame(({ clock }) => {
        if (useMovementStore.getState().getPlayActive() && useMovementStore.getState().time < maxTime) {
            useMovementStore.getState().incrementTime(1)
        }
    })

    return null
}

function sequentialSyntaxTree(
    lineId: string,
    lineX: number,
    lineZ: number,
    lineY: number,
    lineTime: number,
    lineStartDir: number[],
    lineCommands: any[][],
    width: number,
    height: number
): Array<{ name: string; step?: AbstractParsedSequantial<any> }> {
    const syntaxTree = {
        name: lineId,
        step: {
            type: "sequential",
            children: [
                { type: "this" },
                {
                    type: "operation",
                    children: [
                        {
                            type: "operation",
                            identifier: "point3",
                            children: [
                                { type: "raw", value: lineX - width / 2 },
                                { type: "raw", value: lineY },
                                { type: "raw", value: lineZ - height / 2 },
                            ],
                        },
                        { type: "raw", value: lineTime },
                        { type: "raw", value: 0 },
                        {
                            type: "operation",
                            identifier: "point3",
                            children: [
                                { type: "raw", value: lineStartDir[0] },
                                { type: "raw", value: lineStartDir[1] },
                                { type: "raw", value: lineStartDir[2] },
                            ],
                        },
                    ],
                    identifier: "createOb",
                },
            ],
        },
    }

    for (const line of lineCommands) {
        if (line.length == 1) {
            const standStill = { type: "operation", children: [], identifier: "standStill" }
            syntaxTree.step.children.push(standStill)
        } else {
            const angle = parseInt(line[0])
            const distance = line[1]
            const moveRotate = {
                type: "operation",
                children: [
                    { type: "raw", value: angle },
                    { type: "raw", value: distance },
                ],
                identifier: "moveRotate",
            }
            syntaxTree.step.children.push(moveRotate)
        }
    }
    console.log(syntaxTree)

    return [syntaxTree]
}
