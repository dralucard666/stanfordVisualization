import * as THREE from "three"
import { useLoader } from "@react-three/fiber"
import { Suspense, useEffect, useState } from "react"
import { useTexture } from "@react-three/drei"
import { WorldState } from "./useMovementStore"

export default function Floor(props: { world: WorldState | null }) {
    const [colorMfloorNormalTexture] = useTexture(["./textures/dirt/normal.jpg"])
    const [colorMap] = useTexture([props.world?.image ??  "./textures/dirt/bookstore.jpg"])
    colorMap.rotation = Math.PI
    colorMap.encoding = THREE.sRGBEncoding
    colorMap.wrapS = THREE.RepeatWrapping
    colorMap.wrapT = THREE.RepeatWrapping
    colorMfloorNormalTexture.wrapS = THREE.RepeatWrapping
    colorMfloorNormalTexture.wrapT = THREE.RepeatWrapping

    return (
        <>
            <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0, 0]}>
                <planeGeometry args={[props.world?.width ?? 1424, props.world?.height ?? 1088]} />
                <meshStandardMaterial map={colorMap} normalMap={colorMfloorNormalTexture}></meshStandardMaterial>
            </mesh>
            <ambientLight />
        </>
    )
}
