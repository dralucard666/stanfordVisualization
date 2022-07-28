import React, { useRef, useMemo, forwardRef, useImperativeHandle, useEffect } from "react"
import { useGLTF, useAnimations } from "@react-three/drei"
import * as THREE from "three"
import { useGraph, useFrame } from "@react-three/fiber"
import { clone } from "three/examples/jsm/utils/SkeletonUtils"
import { useMovementStore } from "./useMovementStore"

export const Person = (props) => {
    const { scene, materials, animations } = useGLTF("./models/remyplace.glb")
    const clones = useMemo(() => clone(scene), [scene])

    const { nodes } = useGraph(clones)

    const person = useRef()
    const mixer = new THREE.AnimationMixer(clones)
    animations.forEach((clip) => {
        const action = mixer.clipAction(clip)
        action.play()
    })
    /*   useEffect(( ) => {
    const unsubscribe = useStore.subscribe(state => state.currentDataLine)
    return unsubscribe
  },[]) */

    useFrame((state, delta) => {
        let currentLine = useMovementStore.getState().currentDataLine?.obPositions[0]

        if (currentLine) {
            const positionX = currentLine[1]
            const positionY = currentLine[2]
            const positionZ = currentLine[3]

            person.current.rotation.y =
                positionX - person.current.position.x > 0
                    ? 0.5 * Math.PI
                    : positionX - person.current.position.x < 0
                    ? 1.5 * Math.PI
                    : positionZ - person.current.position.z > 0
                    ? 0
                    : Math.PI
            person.current.position.x = positionX
            person.current.position.y = positionY
            person.current.position.z = positionZ
            mixer.update(delta)
        }
    })

    return (
        <group ref={person} dispose={null}>
            <mesh>
                <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.1}>
                    <primitive object={nodes.mixamorigHips} />
                    <skinnedMesh
                        geometry={nodes.Body.geometry}
                        material={materials.Bodymat}
                        skeleton={nodes.Body.skeleton}
                    />
                    <skinnedMesh
                        geometry={nodes.Bottoms.geometry}
                        material={materials.Bottommat}
                        skeleton={nodes.Bottoms.skeleton}
                    />
                    <skinnedMesh
                        geometry={nodes.Eyelashes.geometry}
                        material={materials.Eyelashmat}
                        skeleton={nodes.Eyelashes.skeleton}
                    />
                    <skinnedMesh
                        geometry={nodes.Eyes.geometry}
                        material={materials.Bodymat}
                        skeleton={nodes.Eyes.skeleton}
                    />
                    <skinnedMesh
                        geometry={nodes.Hair.geometry}
                        material={materials.Hairmat}
                        skeleton={nodes.Hair.skeleton}
                    />
                    <skinnedMesh
                        geometry={nodes.Shoes.geometry}
                        material={materials.Shoesmat}
                        skeleton={nodes.Shoes.skeleton}
                    />
                    <skinnedMesh
                        geometry={nodes.Tops.geometry}
                        material={materials.Topmat}
                        skeleton={nodes.Tops.skeleton}
                    />
                </group>
            </mesh>
        </group>
    )
}

useGLTF.preload("./models/remyplace.glb")
