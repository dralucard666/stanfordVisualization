import React, { useRef, useMemo, forwardRef, useImperativeHandle, useEffect } from "react"
import { useGLTF, useAnimations } from "@react-three/drei"
import * as THREE from "three"
import { useGraph, useFrame } from "@react-three/fiber"
import { clone } from "three/examples/jsm/utils/SkeletonUtils"

export const PersonSmallScreen = (props) => {
    const { scene, materials, animations } = useGLTF("./models/remyplace.glb")
    const clones = useMemo(() => clone(scene), [scene, props])

    const { nodes } = useGraph(clones)

    const person = useRef()
    const mixer = new THREE.AnimationMixer(clones)
    animations.forEach((clip) => {
        const action = mixer.clipAction(clip)
        action.play()
    })

    const data = props.data

    useEffect(() => {
        if (data) {
            const direction = data.direction
            person.current.rotation.y = -Math.atan2(direction[2], direction[0]) + Math.PI / 2
            person.current.position.x = data.position[0]
            person.current.position.y = data.position[1]
            person.current.position.z = data.position[2]
            mixer.update(Math.round(Math.random() * 500))
        }
    }, [person, props])

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
