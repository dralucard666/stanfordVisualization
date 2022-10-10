import * as THREE from "three"
import { useLoader } from "@react-three/fiber"
import { Suspense, useEffect, useRef, useState } from "react"
import { useGLTF, useTexture, useFBX, Clone } from "@react-three/drei"
import bookStore0StaticObject from "../../../public/dataStaticObjects/bookstore0.json"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { Group } from "three"
import { WorldState } from "./movementData"

export default function Floor(props: { world: WorldState }) {
    const [colorMfloorNormalTexture] = useTexture(["./textures/dirt/normal.jpg"])
    const [colorMap] = useTexture(["./textures/dirt/studentsreference.png"])
    colorMap.rotation = Math.PI
    colorMap.encoding = THREE.sRGBEncoding
    colorMap.wrapS = THREE.RepeatWrapping
    colorMap.wrapT = THREE.RepeatWrapping
    colorMfloorNormalTexture.wrapS = THREE.RepeatWrapping
    colorMfloorNormalTexture.wrapT = THREE.RepeatWrapping
    const world = props.world
    const rotation = world.rotation ?? [0, 0, 0]
    const scene = useGLTF(world.image)
    const floor = useRef<Group>(null)
    return (
        <>
{/*              <mesh rotation={[-Math.PI / 2, 0, Math.PI]} position={[0, 10, 0]}>
                <planeGeometry args={[props.world?.width ?? 720, props.world?.height ?? 576]} />
                <meshStandardMaterial map={colorMap} normalMap={colorMfloorNormalTexture}></meshStandardMaterial>
            </mesh>  */}
            <Clone ref={floor} rotation={rotation} object={scene.scene} scale={world.scale} position={world.position} />
            <ambientLight intensity={1} />
        </>
    )
}

useGLTF.preload("./models/bookstore.glb")
useGLTF.preload("./models/eth.glb")
useGLTF.preload("./models/zara.glb")
useGLTF.preload("./models/students.glb")
useGLTF.preload("./models/hotel.glb")
useGLTF.preload("./models/little.glb")
