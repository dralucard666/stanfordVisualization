import { PerspectiveCamera, useContextBridge } from "@react-three/drei"
import { Canvas, events, useFrame } from "@react-three/fiber"
import { tileZoomRatio } from "cgv/domains/shape"
import { operations } from "cgv/domains/movement/operations"
import Head from "next/head"
import React, { HTMLProps, Suspense, useEffect, useState } from "react"
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
import { useMovementStore } from "../src/domains/movement/useMovementStore"
import Slider from "../src/domains/movement/slider"
import shallow from "zustand/shallow"
import MovementLogic from "../src/domains/movement/movementLogic"
import { standardTime } from "cgv/domains/movement"
import { dataWorldState, WorldState } from "../src/domains/movement/movementData"

const zoom = 18
const globalLocalRatio = tileZoomRatio(0, zoom)

// id, posX, posY, posZ, size, time, startPos, type, [commands]

export default function Movement() {
    return (
        <>
            <Head>
                <title>CGV | Shape Editor</title>
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

const Objects = (props: { world: WorldState }) => {
    const data = useMovementStore((store) => store.data)
    // const playActive = useMovementStore((store) => store.playActive)
    return (
        <>
            {data
                ? data.map((ob) => {
                      return <MovementLogic key={ob.id} id={ob.id} data={ob} world={props.world} />
                  })
                : null}
        </>
    )
}

const selectWorld = (
    newVal: any,
    setWorldName: any,
    setWorldState: any,
    setDataOptions: any,
    store: UseBaseStore,
    resetMovementData: any
) => {
    const selectedWorld = dataWorldState[newVal]
    setDataOptions(selectedWorld.data ?? null)
    setWorldName(newVal)
    setWorldState(selectedWorld)
    store.getState().deleteAllDescription()
    resetMovementData()
    return
}

const SelectData = (
    dataOptions: { [key: string]: any[] } | null,
    world: WorldState,
    store: UseBaseStore,
    newVal: any,
    setDataName: any,
    resetMovementData: any,
    setLoadingState: any
) => {
    store.getState().deleteAllDescription()
    resetMovementData()
    if (dataOptions && newVal !== "keine Auswahl") {
        const allDescription = []
        const selectedData = dataOptions[newVal]
        setDataName(newVal)
        setLoadingState(true)

        for (const dataLine of selectedData) {
            const lineId = ("ID" + dataLine[0]) as string
            const lineX = dataLine[1] as number
            const lineZ = dataLine[2] as number
            const lineY = dataLine[3] as number
            const lineSize = dataLine[4] as number
            const lineTime = (dataLine[5] * standardTime) as number
            const lineStartDir = dataLine[6] as number[]
            const lineTypeString = dataLine[7] as string
            const lineType = getNumberType(lineTypeString)
            const lineCommands = dataLine[8] as any[]
            const width = world.width
            const height = world.height
            const syntaxData = sequentialSyntaxTree(
                lineId,
                lineX,
                lineZ,
                lineY,
                lineTime,
                lineType,
                lineStartDir,
                lineCommands,
                width ?? 0,
                height ?? 0
            )
            allDescription.push(syntaxData)
        }
        store.getState().addDescriptions(allDescription)
    }
}

export function Viewer({ className, children, ...rest }: HTMLProps<HTMLDivElement>) {
    const Bridge = useContextBridge(domainContext)
    const store = useBaseStore()
    const world = useMovementStore((e) => e.world)
    const setWorldState = useMovementStore((e) => e.setWorld)
    const resetMovementData = useMovementStore((e) => e.resetState)

    const [worldName, setWorldName] = useState<string>()

    const [dataOptions, setDataOptions] = useState<{ [key: string]: any[] } | null>(null)
    const dataNames: string[] = dataOptions ? Object.keys(dataOptions) : ["keine Auswahl"]
    const [dataName, setDataName] = useState<string>("keine Auswahl")
    const loading = useMovementStore((e) => e.loadingState)
    const setLoadingState = useMovementStore((e) => e.setLoadingState)

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
                        <Suspense fallback={null}>
                            <Floor world={world} />
                        </Suspense>
                        <Clock />
                        <PerspectiveCamera makeDefault far={10000} matrixWorldAutoUpdate={undefined} getObjectsByProperty={undefined} />
                        <CameraController />
                    </Bridge>
                    <Objects world={world} />
                </Canvas>
                    {loading ? <div className="spinner-container">
                        <div className="loading-spinner"></div>
                    </div> : null}
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
                    <div className="d-flex flex-column my-3 ms-3" style={{ maxWidth: 300 }}>
                        <div
                            style={{ pointerEvents: "all" }}
                            className={`bg-light rounded shadow w-100 overflow-hidden border d-flex flex-column`}>
                            {loading ? <div>LOADING</div> : null}
                            <div className="w-100 mt-2">Select World</div>
                            <div className="px-3 py-2 border-bottom d-flex flex-row align-items-center">
                                <select
                                    value={worldName}
                                    onChange={(e) => {
                                        selectWorld(
                                            e.target.value,
                                            setWorldName,
                                            setWorldState,
                                            setDataOptions,
                                            store,
                                            resetMovementData
                                        ) // See Issue 2 below
                                    }}
                                    className="form-select">
                                    {dataWorldState.map((worldState, index) => (
                                        <option value={index} key={worldState.name}>
                                            {worldState.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {dataOptions ? (
                                <>
                                    <div className="w-100 mt-2">Select Data</div>
                                    <div className="px-3 py-2 border-bottom d-flex flex-row align-items-center">
                                        <select
                                            value={dataName}
                                            onChange={(e) => {
                                                SelectData(
                                                    dataOptions,
                                                    world,
                                                    store,
                                                    e.target.value,
                                                    setDataName,
                                                    resetMovementData,
                                                    setLoadingState
                                                ) // See Issue 2 below
                                            }}
                                            className="form-select">
                                            <option value={"keine Auswahl"} key={"keine Auswahl"}>
                                                {"keine Auswahl"}
                                            </option>
                                            {dataNames.map((key: string, index: number) => (
                                                <option value={key} key={key}>
                                                    {key}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            ) : null}
                        </div>
                        <div className="flex-grow-1" />
                        <div style={{ pointerEvents: "all" }} className="d-flex flex-row">
                            {/*<SpeedSelection className="me-2" />*/}
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
    lineType: number,
    lineStartDir: number[],
    lineCommands: any[][],
    width: number,
    height: number
): { name: string; step?: AbstractParsedSequantial<any> } {
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
                        { type: "raw", value: lineType },
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
    return syntaxTree
}

function getNumberType(type: string): number {
    switch (type) {
        case "Pedestrian":
            return 0
        case "Biker":
            return 1
        default:
            return 0
    }
}
