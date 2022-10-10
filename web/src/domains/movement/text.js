import React, { useImperativeHandle, forwardRef, useLayoutEffect, useRef, useState } from "react"
import { Text } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"

export const TextComponent = forwardRef((props, ref) => {
    const textRef = useRef()
    const text = props.text.replace("Start@ID","");

    useImperativeHandle(ref, () => ({
        updatePosition(x, y, z) {
            textRef.current.position.x = x
            textRef.current.position.y = y
            textRef.current.position.z = z
        },

        hideText() {
            textRef.current.visible = false
        },

        showText() {
            textRef.current.visible = true
        },
    }))

    useFrame(({ camera }) => {
        textRef.current.quaternion.copy(camera.quaternion)
      })

    return (
        <>
            <Text color={'#000000'} fontSize={8} outlineWidth={"100%"} outlineOpacity={0} ref={textRef}>
                {text}
            </Text>
        </>
    )
})
