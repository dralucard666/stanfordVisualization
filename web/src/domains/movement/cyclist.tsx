import * as THREE from "three"
import React, { forwardRef, MutableRefObject, useEffect, useImperativeHandle, useMemo, useRef } from "react"
import { useGLTF } from "@react-three/drei"
import { GLTF, SkeletonUtils } from "three-stdlib"
import { useFrame, useGraph } from "@react-three/fiber"
import { framePositions, movObject, useMovementStore } from "./useMovementStore"

type GLTFResult = GLTF & {
    nodes: {
        Chain_Chain_0: THREE.Mesh
        eyeball1_eyeball1_0: THREE.Mesh
        Frame_Frame_0: THREE.Mesh
        Handlebars_Handlebars_0: THREE.Mesh
        Rims_Rims_0: THREE.Mesh
        Saddle_Saddle_0: THREE.Mesh
        Spokes_Spokes_0: THREE.Mesh
        Tyres_Tyres_0: THREE.Mesh
        UMesh_Figure_1_UMesh_Figure_1_0: THREE.Mesh
        UMesh_Figure_1_UMesh_Figure_1_0001: THREE.Mesh
        UMesh_Figure_1_UMesh_Figure_1_0002: THREE.Mesh
    }
    materials: {
        Chain_COLOR_0: THREE.MeshStandardMaterial
        eyeball1: THREE.MeshStandardMaterial
        Frame_COLOR_0: THREE.MeshStandardMaterial
        Handlebars_COLOR_0: THREE.MeshStandardMaterial
        Rims_COLOR_0: THREE.MeshStandardMaterial
        Saddle_COLOR_0: THREE.MeshStandardMaterial
        Spokes_COLOR_0: THREE.MeshStandardMaterial
        Tyres_COLOR_0: THREE.MeshStandardMaterial
        UMesh_Figure_1: THREE.MeshStandardMaterial
    }
}

export const Cyclist = forwardRef((props: { id: string | null; scale: number; positionY: number }, ref) => {
    const group = useRef<any>()
    const { nodes, materials } = useGLTF("./models/cyclist.glb") as GLTFResult

    useImperativeHandle(ref, () => ({
        updatePosition(x: number, y: number, z: number, angle: number, delta: number) {
            group.current.rotation.y = angle
            group.current.position.z = z
            group.current.position.x = x
        },

        hideObject() {
            group.current.visible = false
        },

        showObject() {
            group.current.visible = true
        },
    }))

    return (
        <>
            <group
                ref={(group as MutableRefObject<THREE.Group>) ?? null}
                dispose={null}
                scale={props.scale}
                position={[0, props.positionY, 0]}>
                <group rotation={[Math.PI / 2, 0, Math.PI / 2]}>
                    <mesh geometry={nodes.Chain_Chain_0.geometry} material={materials.Chain_COLOR_0} />
                    <mesh geometry={nodes.eyeball1_eyeball1_0.geometry} material={materials.eyeball1} />
                    <mesh geometry={nodes.Frame_Frame_0.geometry} material={materials.Frame_COLOR_0} />
                    <mesh geometry={nodes.Handlebars_Handlebars_0.geometry} material={materials.Handlebars_COLOR_0} />
                    <mesh geometry={nodes.Rims_Rims_0.geometry} material={materials.Rims_COLOR_0} />
                    <mesh geometry={nodes.Saddle_Saddle_0.geometry} material={materials.Saddle_COLOR_0} />
                    <mesh geometry={nodes.Spokes_Spokes_0.geometry} material={materials.Spokes_COLOR_0} />
                    <mesh geometry={nodes.Tyres_Tyres_0.geometry} material={materials.Tyres_COLOR_0} />
                    <mesh
                        geometry={nodes.UMesh_Figure_1_UMesh_Figure_1_0.geometry}
                        material={materials.UMesh_Figure_1}
                    />
                    <mesh
                        geometry={nodes.UMesh_Figure_1_UMesh_Figure_1_0001.geometry}
                        material={materials.UMesh_Figure_1}
                    />
                    <mesh
                        geometry={nodes.UMesh_Figure_1_UMesh_Figure_1_0002.geometry}
                        material={materials.UMesh_Figure_1}
                    />
                </group>
            </group>
        </>
    )
})

useGLTF.preload("./models/cyclist.glb")
