import * as THREE from "three"
import { TextureLoader } from "three/src/loaders/TextureLoader"
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
    const colorMfloorNormalTexture = useLoader(TextureLoader, ImagePaths.normalImage as string)
    const colorMap = useLoader(TextureLoader, ImagePaths.bookstoreImage as string)
    colorMap.rotation = Math.PI
    colorMap.encoding = THREE.sRGBEncoding
    colorMap.wrapS = THREE.RepeatWrapping
    colorMap.wrapT = THREE.RepeatWrapping
    colorMfloorNormalTexture.wrapS = THREE.RepeatWrapping
    colorMfloorNormalTexture.wrapT = THREE.RepeatWrapping

    const world = props.world
    const worldImage = world?.image ?? ImageName.bookstore

    let image = null
    switch (+worldImage) {
        case ImageName.coupa: {
            image = ImagePaths.coupaImage
            break
        }
        case ImageName.bookstore: {
            image = ImagePaths.bookstoreImage
            console.log(image)
            break
        }
        case ImageName.deathCircle: {
            image = ImagePaths.deathCircleImage
            break
        }
        case ImageName.gates: {
            image = ImagePaths.gatesImage
            break
        }
        case ImageName.hyang: {
            image = ImagePaths.hyangImage
            break
        }
        case ImageName.little: {
            image = ImagePaths.littleImage
            break
        }
        case ImageName.nexus: {
            image = ImagePaths.nexusImage
            break
        }
        default: {
            image = ImagePaths.quadImage
            break
        }
    }

    console.log(colorMap)
    console.log(colorMfloorNormalTexture)

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[world?.width ?? 1424, world?.height ?? 1088]} />
                <ProfileDetails />
        </mesh>
    )
}

function ProfileDetails() {
    const colorMfloorNormalTexture = useLoader(TextureLoader, ImagePaths.normalImage as string)
    const colorMap = useLoader(TextureLoader, ImagePaths.bookstoreImage as string)
    colorMap.rotation = Math.PI
    colorMap.encoding = THREE.sRGBEncoding
    colorMap.wrapS = THREE.RepeatWrapping
    colorMap.wrapT = THREE.RepeatWrapping
    colorMfloorNormalTexture.wrapS = THREE.RepeatWrapping
    colorMfloorNormalTexture.wrapT = THREE.RepeatWrapping
    console.log(colorMfloorNormalTexture)
    console.log(colorMap)

    return <meshStandardMaterial map={colorMap} normalMap={colorMfloorNormalTexture} />
}
