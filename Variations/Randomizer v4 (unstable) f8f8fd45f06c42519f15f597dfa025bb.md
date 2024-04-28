# Randomizer v4 (unstable)

```tsx
import React, { useState } from "react";
import Matter from "matter-js";
import { addPropertyControls, ControlType } from "framer";

import { makeWalls } from "./MakeWalls.tsx";
import { makeBodies } from "./MakeBodies.tsx";

function applyCenterAttractionForces(engine, containerBounding) {
  const bodies = Matter.Composite.allBodies(engine.world);
  const centerX = containerBounding.width / 2;
  const centerY = containerBounding.height / 2;

  bodies.forEach((body) => {
    if (!body.isStatic) {
      const directionX = centerX - body.position.x;
      const directionY = centerY - body.position.y;

      const distance = Math.sqrt(
        directionX * directionX + directionY * directionY
      );
      const normalizedDirectionX = directionX / distance;
      const normalizedDirectionY = directionY / distance;

      const forceMagnitude = 1;
      Matter.Body.applyForce(body, body.position, {
        x: normalizedDirectionX * forceMagnitude,
        y: normalizedDirectionY * forceMagnitude,
      });
    }
  });
}

export default function Physics(props) {
  const [childIndex, setChildIndex] = useState(Math.floor(Math.random() * 3));
  let engine;

  React.useEffect(() => {
    if (!engine) {
      engine = Matter.Engine.create({
        enableSleeping: props.sleeping,
        gravity: { y: 0, x: 0 },
      });
      const containerBounding = containerRef.current.getBoundingClientRect();

      makeWalls(containerBounding, engine.world, props.wallOptions);

      let mouseConstraint = null;
      if (props.mouseOptions.enable) {
        let mouse = Matter.Mouse.create(containerRef.current);

        mouseConstraint = Matter.MouseConstraint.create(engine, {
          mouse: mouse,
          constraint: {
            angularStiffness: props.mouseOptions.angularStiffness,
            stiffness: props.mouseOptions.stiffness,
          },
        });
        Matter.Composite.add(engine.world, mouseConstraint);

        mouseConstraint.mouse.element.removeEventListener(
          "mousewheel",
          mouseConstraint.mouse.mousewheel
        );
        mouseConstraint.mouse.element.removeEventListener(
          "DOMMouseScroll",
          mouseConstraint.mouse.mousewheel
        );
        mouseConstraint.mouse.element.removeEventListener(
          "touchstart",
          mouseConstraint.mouse.mousedown
        );
        mouseConstraint.mouse.element.removeEventListener(
          "touchmove",
          mouseConstraint.mouse.mousemove
        );
        mouseConstraint.mouse.element.removeEventListener(
          "touchend",
          mouseConstraint.mouse.mouseup
        );

        mouseConstraint.mouse.element.addEventListener(
          "touchstart",
          mouseConstraint.mouse.mousedown,
          { passive: true }
        );
        mouseConstraint.mouse.element.addEventListener("touchmove", (e) => {
          if (mouseConstraint.body) {
            mouseConstraint.mouse.mousemove(e);
          }
        });
        mouseConstraint.mouse.element.addEventListener("touchend", (e) => {
          if (mouseConstraint.body) {
            mouseConstraint.mouse.mouseup(e);
          }
        });

        containerRef.current.addEventListener("mouseleave", () => {
          mouseConstraint.mouse.mouseup(event);
        });
      }

      let stack = makeBodies(
        containerRef.current,
        engine.world,
        containerRef.current.children,
        props.frictionOptions,
        props.densityOptions
      );

      (function update() {
        requestAnimationFrame(update);

        stack.bodies.forEach((block, i) => {
          let el = containerRef.current.children[i];
          let { x, y } = block.vertices[0];

          el.style.visibility = "visible";

          el.style.top = `${y}px`;
          el.style.left = `${x}px`;
          el.style.transform = `
                          translate(-50%, -50%)
                          rotate(${block.angle}rad) 
                          translate(50%, 50%)
                          `;
        });

        Matter.Engine.update(engine);
      })();

      const forceInterval = setInterval(
        () => applyCenterAttractionForces(engine, containerBounding),
        5
      );

      return () => {
        clearInterval(forceInterval);
      };
    }
  }, []);

  const containerRef = React.useRef(null);

  const childrenSets = [
    props.childrenSet1 || <div>No children set 1</div>,
    props.childrenSet2 || <div>No children set 2</div>,
    props.childrenSet3 || <div>No children set 3</div>,
  ];

  return (
    <div
      style={containerStyle}
      ref={containerRef}
      draggable="false"
      onDragStart={(e) => {
        e.preventDefault();
      }}
    >
      {childrenSets[childIndex]}
    </div>
  );
}

const containerStyle = {
  height: "100%",
  width: "100%",
  overflow: "hidden",
};
const bodyStyle = {
  position: "absolute",
  visibility: "hidden",
};

Physics.defaultProps = {
  gravX: 0,
  gravY: 1,
  children: {},
  wallOptions: { top: true, bottom: true, right: true, left: true },
  frictionOptions: { friction: 0.1, frictionAir: 0.01 },
  mouseOptions: {
    angularStiffnes: 0,
    stiffness: 0.2,
    enable: true,
  },
  densityOptions: { enable: true, density: 0.001 },
  sleeping: false,
  childrenSet1: [],
  childrenSet2: [],
  childrenSet3: [],
};
// Propertiy Settings
```