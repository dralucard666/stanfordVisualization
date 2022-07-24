import { useContextBridge, RenderTexture } from "@react-three/drei"
import { Canvas, events } from "@react-three/fiber"
import { patterns, tileZoomRatio } from "cgv/domains/shape"
import { operations } from "cgv/domains/movement/operations"
import Head from "next/head"
import React, { HTMLProps, Suspense, useState } from "react"
import { Texture } from "three"
import { createBaseState } from "../src/base-state"
import { CameraController } from "../src/domains/movement/camera"
import Floor from "../src/domains/movement/floor"
import {
    Background,
    DownloadButton,
    ExitStreetViewButton,
    FlyCameraButton,
    Foreground,
    generateLots,
    generateRoads,
    MultiSelectButton,
    onDrop,
    operationGuiMap,
    Panoramas,
    ShowError,
    Skybox,
    SummarizeButton,
    tileDescriptionSuffix,
} from "../src/domains/shape"
import { GeoSearch } from "../src/domains/shape/geo-search"
import { ViewerCamera } from "../src/domains/shape/viewer/camera"
import { PanoramaView } from "../src/domains/shape/viewer/panorama"
import { useViewerState, getPosition } from "../src/domains/shape/viewer/state"
import { Tiles, BackgroundTile, DescriptionTile } from "../src/domains/shape/viewer/tile"
import { ViewControls } from "../src/domains/shape/viewer/view-controls"
import { VisualSelection } from "../src/domains/shape/viewer/visual-selection"
import { Editor } from "../src/editor"
import { domainContext, DomainProvider, useBaseStore } from "../src/global"
import { GUI } from "../src/gui"
import { DescriptionList } from "../src/gui/description-list"
import { TextEditorToggle } from "../src/gui/toggles/text"

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
                store={createBaseState(operations, patterns)}
                Viewer={Viewer}
                operationGuiMap={operationGuiMap}
                operations={operations}>
                <Editor />
            </DomainProvider>
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
                    <axesHelper />
                    <Floor world={null} />
                    <CameraController />
                </Canvas>
                <div
                    className="d-flex flex-row flex-column align-items-end m-3 position-absolute"
                    style={{
                        pointerEvents: "none",
                        inset: 0,
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                    }}>
                    <div className="flex-grow-1"></div>
                    <div className="d-flex flex-row" style={{ pointerEvents: "all" }}>
                        <TextEditorToggle className="me-2" />
                        {/*<FullscreenToggle rootRef={null} />*/}
                    </div>
                </div>
                {children}
            </div>
        </Suspense>
    )
}
