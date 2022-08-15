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

    const data = props.data

    useEffect(() => {
        console.log('wird ausgefhurt')
        person.current.rotation.y = data.direction[0]*Math.PI
    }, [person])

    useFrame((state, delta) => {
        const currentTime = useMovementStore.getState().time
        const playActive = useMovementStore.getState().playActive

        if (data.startT <= currentTime && currentTime <= data.endT && data.framePos && playActive) {
            /*             person.traverse((child) => {
                if (child instanceof THREE.SkinnedMesh) {
                    child.visible = true
                }
            }) */
            const arrayIndex = currentTime - data.startT
            const currentLine = data.framePos[arrayIndex]
            //  console.log(arrayIndex)
            //  console.log(data.framePos)
            const positionX = currentLine.position[0]
            const positionY = currentLine.position[1]
            const positionZ = currentLine.position[2]

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
        } else {
            mixer.update(delta)
            /*             person.traverse((child) => {
                if (child instanceof THREE.SkinnedMesh) {
                    child.visible = false
                }
            }) */
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
