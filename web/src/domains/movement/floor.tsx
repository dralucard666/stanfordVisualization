import * as THREE from "three"
import { useLoader } from "@react-three/fiber"
import normalImage from "./textures/dirt/normal.jpg"
import coupaImage from "./textures/dirt/coupa.jpg"
import deathCircleImage from "../textures/dirt/deathCircle.jpg"
import gatesImage from "./textures/dirt/gates.jpg"
import hyangImage from "./textures/dirt/hyang.jpg"
import littleImage from "./textures/dirt/little.jpg"
import nexusImage from "./textures/dirt/nexus.jpg"
import quadImage from "./textures/dirt/quad.jpg"
import bookstoreImage from "./textures/dirt/bookstore.jpg"
import { Suspense, useEffect, useState } from "react"
import { useTexture } from "@react-three/drei"

export enum ImageName {
    bookstore,
    coupa,
    deathCircle,
    gates,
    hyang,
    little,
    nexus,
    quad,
}

export interface WorldState {
    image: ImageName
    width?: number
    height?: number
}

export const ImagePaths: any = {
    normalImage: "./textures/dirt/normal.jpg",
    coupaImage: "./textures/dirt/coupa.jpg",
    deathCircleImage: "../textures/dirt/deathCircle.jpg",
    gatesImage: "./textures/dirt/gates.jpg",
    hyangImage: "./textures/dirt/hyang.jpg",
    littleImage: "./textures/dirt/little.jpg",
    nexusImage: "./textures/dirt/nexus.jpg",
    quadImage: "./textures/dirt/quad.jpg",
    bookstoreImage: "./textures/dirt/bookstore.jpg",
}

export default function Floor(props: { world: WorldState | null }) {
    const [colorMfloorNormalTexture] = useTexture(["./textures/dirt/normal.jpg"])
    const [colorMap] = useTexture(["./textures/dirt/bookstore.jpg"])
    colorMap.rotation = Math.PI
    colorMap.encoding = THREE.sRGBEncoding
    colorMap.wrapS = THREE.RepeatWrapping
    colorMap.wrapT = THREE.RepeatWrapping
    colorMfloorNormalTexture.wrapS = THREE.RepeatWrapping
    colorMfloorNormalTexture.wrapT = THREE.RepeatWrapping

    const world = props.world

    return (
        <>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[props.world?.width ?? 1424, props.world?.height ?? 1088]} />
                <meshStandardMaterial map={colorMap} normalMap={colorMfloorNormalTexture}></meshStandardMaterial>
            </mesh>
            <ambientLight />
        </>
    )
}
