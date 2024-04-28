import React, { useState } from "react";
import Matter from "matter-js";
import { addPropertyControls, ControlType } from "framer";

import { makeWalls } from "./MakeWalls.tsx";
import { makeBodies } from "./MakeBodies.tsx";

/**
 * These annotations control how your component sizes
 * Learn more: https://www.framer.com/docs/guides/auto-sizing
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */

function applyCenterAttractionForces(engine, containerBounding) {
  const bodies = Matter.Composite.allBodies(engine.world);
  const centerX = containerBounding.width / 2;
  const centerY = containerBounding.height / 2;

  bodies.forEach((body) => {
    if (!body.isStatic) {
      // Calculate direction towards the center
      const directionX = centerX - body.position.x;
      const directionY = centerY - body.position.y;

      // Normalize the direction
      const distance = Math.sqrt(
        directionX * directionX + directionY * directionY
      );
      const normalizedDirectionX = directionX / distance;
      const normalizedDirectionY = directionY / distance;

      // Apply a force towards the center
      const forceMagnitude = 1;
      Matter.Body.applyForce(body, body.position, {
        x: normalizedDirectionX * forceMagnitude,
        y: normalizedDirectionY * forceMagnitude,
      });
    }
  });
}

export default function Physics(props) {
  const [childSet, setChildSet] = useState([]);

  function selectChildSet() {
    const sets = [
      props.childrenSet1,
      props.childrenSet2,
      props.childrenSet3,
    ].filter((set) => set.length);
    const randomIndex = Math.floor(Math.random() * sets.length);
    setChildSet(sets[randomIndex] || []);
  }

  let engine;

  React.useEffect(() => {
    selectChildSet();

    if (!engine) {
      engine = Matter.Engine.create({
        enableSleeping: props.sleeping,
        gravity: { y: props.gravY, x: props.gravX },
      });
      const containerBounding = containerRef.current.getBoundingClientRect();

      makeWalls(containerBounding, engine.world, props.wallOptions);

      if (props.debug) {
        var render = Matter.Render.create({
          element: containerRef.current,
          engine: engine,
          options: {
            height: containerBounding.height,
            width: containerBounding.width,
            showAngleIndicator: true,
            showVelocity: true,
          },
        });
        Matter.Render.run(render);
      }

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

      // Cleanup on component unmount
      return () => {
        clearInterval(forceInterval);
      };
    }
  }, [childSet]);

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
      onDragStart={(e) => e.preventDefault()}
    >
      {childSet.map((child, index) => (
        <div key={index} style={bodyStyle}>
          {child}
        </div>
      ))}
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

addPropertyControls(Physics, {
  childrenSet1: {
    type: ControlType.Array,
    title: "Set 1",
    control: {
      type: ControlType.ComponentInstance,
    },
  },
  childrenSet2: {
    type: ControlType.Array,
    title: "Set 2",
    control: {
      type: ControlType.ComponentInstance,
    },
  },
  childrenSet3: {
    type: ControlType.Array,
    title: "Set 3",
    control: {
      type: ControlType.ComponentInstance,
    },
  },
  gravY: {
    type: ControlType.Number,
    defaultValue: 0,
    max: 5,
    min: -5,
    step: 0.25,
    title: "Gravity Y",
  },
  gravX: {
    type: ControlType.Number,
    defaultValue: 0,
    max: 5,
    min: -5,
    step: 0.25,
    title: "Gravity X",
  },
  wallOptions: {
    title: "Walls",
    type: ControlType.Object,
    controls: {
      top: { type: ControlType.Boolean, defaultValue: true },
      bottom: { type: ControlType.Boolean, defaultValue: true },

      right: { type: ControlType.Boolean, defaultValue: true },
      left: { type: ControlType.Boolean, defaultValue: true },
    },
  },

  mouseOptions: {
    title: "Mouse",
    type: ControlType.Object,
    controls: {
      enable: {
        title: "Enable",
        type: ControlType.Boolean,
        defaultValue: true,
      },
      angularStiffness: {
        title: "Angular stiffness",
        description:
          "A value of 0 allows objects to swing when held by the mouse",
        type: ControlType.Number,
        defaultValue: 0,
        min: 0,
        max: 1,
        step: 0.01,
      },
      stiffness: {
        title: "Stiffness",
        description:
          "Click + drag creates a moving constraint (spring) that follows the mouse. This describes the stiffness of that spring",
        type: ControlType.Number,
        defaultValue: 0.2,
        min: 0.001,
        max: 1,
        step: 0.01,
      },
    },
  },
  friction: {
    type: ControlType.Object,
    controls: {
      friction: {
        title: "Body friction",
        type: ControlType.Number,
        min: 0,
        max: 1,
        defaultValue: 0.1,
        step: 0.01,
      },
      frictionAir: {
        title: "Air friction",
        type: ControlType.Number,
        min: 0,
        max: 1,
        defaultValue: 0.01,
        step: 0.01,
      },
    },
  },
  densityOptions: {
    title: "Density",
    type: ControlType.Object,
    controls: {
      enable: {
        type: ControlType.Boolean,
        defaultValue: true,
        description:
          "Enabling density will cause mass to be calculated based on width and height",
      },
      density: {
        type: ControlType.Number,
        defaultValue: 0.001,
        min: 0.001,
        max: 1,
        step: 0.01,
      },
    },
  },
  sleeping: {
    title: "Sleeping",
    description: "Improves performance at the cost of simulation accuracy",
    type: ControlType.Boolean,
    defaultValue: false,
  },
});
