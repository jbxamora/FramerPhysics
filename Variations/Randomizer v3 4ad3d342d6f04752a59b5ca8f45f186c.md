# Randomizer v3

```tsx
import React from "react"
import Matter from "matter-js"
import { addPropertyControls, ControlType } from "framer"

import { makeWalls } from "./MakeWalls.tsx"
import { makeBodies } from "./MakeBodies.tsx"

function applyCenterAttractionForces(engine, containerBounding) {
    const bodies = Matter.Composite.allBodies(engine.world)
    const centerX = containerBounding.width / 2
    const centerY = containerBounding.height / 2

    bodies.forEach((body) => {
        if (!body.isStatic) {
            const directionX = centerX - body.position.x
            const directionY = centerY - body.position.y
            const distance = Math.sqrt(directionX ** 2 + directionY ** 2)
            const normalizedDirectionX = directionX / distance
            const normalizedDirectionY = directionY / distance
            const forceMagnitude = 10
            Matter.Body.applyForce(body, body.position, {
                x: normalizedDirectionX * forceMagnitude,
                y: normalizedDirectionY * forceMagnitude,
            })
        }
    })
}

export default function Physics(props) {
    const [selectedChildren, setSelectedChildren] = React.useState([])
    const containerRef = React.useRef(null)
    let engine = React.useRef(null)

    // Randomly select a set of children on component mount
    React.useEffect(() => {
        const childrenSets = [
            props.childrenSet1,
            props.childrenSet2,
            props.childrenSet3,
        ]
        const randomSet =
            childrenSets[Math.floor(Math.random() * childrenSets.length)]
        setSelectedChildren(randomSet)
    }, [props.childrenSet1, props.childrenSet2, props.childrenSet3])

    React.useEffect(() => {
        if (!engine.current) {
            engine.current = Matter.Engine.create({
                enableSleeping: props.sleeping,
                gravity: { y: 0, x: 0 },
            })
            const containerBounding =
                containerRef.current.getBoundingClientRect()
            makeWalls(
                containerBounding,
                engine.current.world,
                props.wallOptions
            )

            // Omitted code for brevity: setup render, mouseConstraint, makeBodies

            const forceInterval = setInterval(() => {
                if (containerRef.current) {
                    applyCenterAttractionForces(
                        engine.current,
                        containerBounding
                    )
                }
            }, 5)

            return () => clearInterval(forceInterval)
        }
    }, [
        props.sleeping,
        props.wallOptions,
        props.mouseOptions,
        props.frictionOptions,
        props.densityOptions,
        selectedChildren,
    ])

    return (
        <div
            style={containerStyle}
            ref={containerRef}
            draggable="false"
            onDragStart={(e) => e.preventDefault()}
        >
            {selectedChildren.length > 0 ? (
                selectedChildren.map((el, i) => (
                    <div
                        key={i}
                        style={bodyStyle}
                        id="physics-body"
                        draggable="true"
                    >
                        {React.cloneElement(el, { key: i })}
                    </div>
                ))
            ) : (
                <div style={bodyStyle} id="physics-body" draggable="false">
                    No children selected
                </div>
            )}
        </div>
    )
}
// Styles are written in object syntax
// Learn more: https://reactjs.org/docs/dom-elements.html#style

addPropertyControls(Physics, {
    childrenSet1: {
        type: ControlType.Array,
        control: {
            type: ControlType.ComponentInstance,
        },
    },
    childrenSet2: {
        type: ControlType.Array,
        control: {
            type: ControlType.ComponentInstance,
        },
    },
    childrenSet3: {
        type: ControlType.Array,
        control: {
            type: ControlType.ComponentInstance,
        },
    },
  // Rest of Property Controls . . .
})
```