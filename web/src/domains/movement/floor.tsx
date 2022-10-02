import * as THREE from "three"
import { useLoader } from "@react-three/fiber"
import { Suspense, useEffect, useRef, useState } from "react"
import { useGLTF, useTexture, useFBX, Clone } from "@react-three/drei"
import { WorldState } from "./useMovementStore"
import bookStore0StaticObject from "../../../public/dataStaticObjects/bookstore0.json"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { Group } from "three"

export default function Floor(props: { world: WorldState | null }) {
    const [colorMfloorNormalTexture] = useTexture(["./textures/dirt/normal.jpg"])
    const [colorMap] = useTexture([props.world?.image ?? "./textures/dirt/bookstore.jpg"])
    colorMap.rotation = Math.PI
    colorMap.encoding = THREE.sRGBEncoding
    colorMap.wrapS = THREE.RepeatWrapping
    colorMap.wrapT = THREE.RepeatWrapping
    colorMfloorNormalTexture.wrapS = THREE.RepeatWrapping
    colorMfloorNormalTexture.wrapT = THREE.RepeatWrapping
    const scene = useFBX("./models/bookstore2.fbx")
    const floor = useRef<Group>(null)
    return (
        <>
            {/*             <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 10, 0]}>
                <planeGeometry args={[props.world?.width ?? 1424, props.world?.height ?? 1088]} />
                <meshStandardMaterial map={colorMap} normalMap={colorMfloorNormalTexture}></meshStandardMaterial>
            </mesh> */}
            <Clone ref={floor} rotation={[0, 0, 0]} object={scene} scale={[2.6, 2.8, 3.1]} position={[20, 0, -20]} />
            <ambientLight />
        </>
    )
}

useFBX.preload("./models/bookstore2.fbx")
