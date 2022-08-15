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
import { domainContext, DomainProvider, useBaseStore } from "../src/global"
import { TextEditorToggle } from "../src/gui/toggles/text"
import {
    allPatternType,
    idPatternType,
    indexGreaterEqualPatternType,
    indexModuloPatternType,
    indexPatternType,
    indexSmallerEqualPatternType,
} from "cgv"
import { Descriptions } from "../src/domains/movement/description"
import { DescriptionList } from "../src/gui/description-list"
import { GUI } from "../src/gui"
import { useMovementStore } from "../src/domains/movement/useMovementStore"
import Slider from "../src/domains/movement/slider"
import { Person } from "../src/domains/movement/personGltf"
import shallow from "zustand/shallow"

const zoom = 18
const globalLocalRatio = tileZoomRatio(0, zoom)

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
                        <Floor world={null} />
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
