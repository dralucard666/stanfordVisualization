import { Sphere, useContextBridge } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import {
    convertLotsToSteps,
    convertRoadsToSteps,
    loadMapLayers,
    tileMeterRatio,
    tileZoomRatio,
} from "cgv/domains/shape"
import { HTMLProps, DragEvent } from "react"
import { ErrorMessage } from "../../../error-message"
import { domainContext, UseBaseStore, useBaseStore } from "../../../global"
import { panoramas } from "../global"
import { ViewerCamera } from "./camera"
import { getPosition, useViewerState } from "./state"
import { ViewControls } from "./view-controls"
import { ImageIcon } from "../../../icons/image"
import { BackIcon } from "../../../icons/back"
import { SpeedSelection } from "../../../gui/speed-selection"
import { MultiSelectIcon } from "../../../icons/multi-select"
import { DescriptionList } from "../../../gui/description-list"
import { GUI } from "../../../gui"
import { TextEditorToggle } from "../../../gui/toggles/text"
import { GeoSearch } from "../geo-search"
import { Tiles } from "./tile"
import { PanoramaView } from "./panorama"
import { getTileUrl } from "../available-tiles"
import { DownloadIcon } from "../../../icons/download"

export function tileDescriptionSuffix(x: number, y: number): string {
    return `_${x}_${y}`
}

function onDrop(store: UseBaseStore, e: DragEvent<HTMLDivElement>) {
    e.stopPropagation()
    e.preventDefault()
    if (e.dataTransfer?.files.length === 1) {
        e.dataTransfer.files[0].text().then((text) => store.getState().import(text))
    }
}

export function Viewer({ className, children, ...rest }: HTMLProps<HTMLDivElement>) {
    const Bridge = useContextBridge(domainContext)
    const store = useBaseStore()

    return (
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
                dpr={global.window == null ? 1 : window.devicePixelRatio}>
                <Bridge>
                    <ViewerCamera />
                    <ViewControls />
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 10]} intensity={0.5} />
                    <PanoramaView />
                    <Panoramas />
                    <Tiles />
                </Bridge>
            </Canvas>
            <div
                className="d-flex flex-row justify-content-between position-absolute"
                style={{ pointerEvents: "none", inset: 0 }}>
                <div className="d-flex flex-column my-3 ms-3" style={{ maxWidth: 160 }}>
                    <GeoSearch style={{ pointerEvents: "all" }} className="mb-3" />
                    <DescriptionList
                        createDescriptionRequestData={() => {
                            const [globalX, globalY, globalZ] = getPosition(useViewerState.getState())
                            const x = Math.floor(globalX * globalLocalRatio)
                            const y = Math.floor(globalZ * globalLocalRatio)
                            return { suffix: tileDescriptionSuffix(x, y) }
                        }}
                        style={{ pointerEvents: "all" }}
                        className="mb-3">
                        <div className="p-2 border-top border-1">
                            <div className="w-100 btn-sm btn btn-outline-secondary" onClick={() => generateLots(store)}>
                                Generate Lots
                            </div>
                            <div
                                className="w-100 btn-sm btn mt-2 btn-outline-secondary"
                                onClick={() => generateRoads(store)}>
                                Generate Roads
                            </div>
                        </div>
                    </DescriptionList>
                    <div className="flex-grow-1" />
                    <div style={{ pointerEvents: "all" }} className="d-flex flex-row">
                        <MultiSelectButton className="me-2" />
                        <BackgroundToggle className="me-2" />
                        <BackButton className="me-2" />
                        <SpeedSelection className="me-2" />
                        <DownloadButton className="me-2" />
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
    )
}

const zoom = 18
const globalLocalRatio = tileZoomRatio(0, zoom)

async function generateLots(store: UseBaseStore) {
    const [globalX, , globalZ] = getPosition(useViewerState.getState())
    const x = Math.floor(globalX * globalLocalRatio)
    const y = Math.floor(globalZ * globalLocalRatio)
    const url = getTileUrl(zoom, x, y, "mvt")
    if (url == null) {
        return
    }
    const layers = await loadMapLayers(url, y, zoom)
    const extent = /**1 tile */ tileMeterRatio(y, zoom)
    const newDescriptions = convertLotsToSteps(layers, tileDescriptionSuffix(x, y), "exclude", extent)
    store.getState().addDescriptions(newDescriptions)
}

async function generateRoads(store: UseBaseStore) {
    const [globalX, , globalZ] = getPosition(useViewerState.getState())
    const x = Math.floor(globalX * globalLocalRatio)
    const y = Math.floor(globalZ * globalLocalRatio)
    const url = getTileUrl(zoom, x, y, "mvt")
    if (url == null) {
        return
    }
    const layers = await loadMapLayers(url, y, zoom)
    const extent = /**1 tile */ tileMeterRatio(y, zoom)
    const newDescriptions = convertRoadsToSteps(layers, tileDescriptionSuffix(x, y), "clip", extent)
    store.getState().addDescriptions(newDescriptions)
}

function ShowError() {
    const error = useViewerState((state) => state.error)
    if (error == null) {
        return null
    }
    return <ErrorMessage message={error} align="left" />
}

function Panoramas() {
    return (
        <>
            {panoramas.map(({ position }, index) => (
                <Sphere
                    key={index}
                    position={position}
                    onClick={(e) => {
                        e.stopPropagation()
                        useViewerState.getState().changePanoramaView(index)
                    }}
                    scale={0.00000005}>
                    <meshBasicMaterial color={0x0000ff} />
                </Sphere>
            ))}
        </>
    )
}

function DownloadButton({ className, ...rest }: HTMLProps<HTMLDivElement>) {
    const store = useBaseStore()

    return (
        <div
            {...rest}
            onClick={() => store.getState().download()}
            className={`${className} d-flex align-items-center justify-content-center btn btn-primary btn-sm `}>
            <DownloadIcon />
        </div>
    )
}

function BackgroundToggle({ className, ...rest }: HTMLProps<HTMLDivElement>) {
    const showBackground = useViewerState((state) => state.showBackground)
    return (
        <div
            {...rest}
            onClick={() => useViewerState.getState().toggleBackground()}
            className={`${className} d-flex align-items-center justify-content-center btn ${
                showBackground ? "btn-primary" : "btn-secondary"
            } btn-sm `}>
            <ImageIcon />
        </div>
    )
}

function MultiSelectButton({ className, ...rest }: HTMLProps<HTMLDivElement>) {
    const store = useBaseStore()
    const shift = store((s) => (s.type === "gui" ? s.shift : false))
    return (
        <div
            {...rest}
            onPointerDown={() => store.getState().setShift(true)}
            onPointerUp={() => store.getState().setShift(false)}
            className={`${className} d-flex align-items-center justify-content-center btn ${
                shift ? "btn-primary" : "btn-secondary"
            } btn-sm `}>
            <MultiSelectIcon />
        </div>
    )
}

function BackButton({ className, ...rest }: HTMLProps<HTMLDivElement>) {
    const viewType = useViewerState(({ viewType }) => viewType)
    if (viewType != "3d") {
        return null
    }
    return (
        <div
            {...rest}
            className={`${className} d-flex align-items-center justify-content-center btn btn-sm btn-primary`}
            onClick={() => useViewerState.getState().exitPanoramaView()}>
            <BackIcon />
        </div>
    )
}
