import { Text } from "troika-three-text"
import React, { useImperativeHandle, forwardRef, useLayoutEffect, useRef, useState } from "react"
import { Scene } from "three"

export const TextComponent = forwardRef((props, ref) => {
    const [scene] = useState(() => new Scene())
    const textRef = useRef()

    useImperativeHandle(ref, () => ({
        updatePosition(x, y, z) {
            textRef.current.position.x = x
            textRef.current.position.y = y
            textRef.current.position.z = z
        },
    }))

    useLayoutEffect(() => {
        const myText = new Text()
        scene.add(myText)
        myText.text = props.text
        myText.fontSize = 5
        myText.color = 0x000000
        return () => void scene
    }, [])
    return <primitive object={scene} ref={textRef}/>
})
