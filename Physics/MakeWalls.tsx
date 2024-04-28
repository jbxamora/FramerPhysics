import type { ComponentType } from "react";
import Matter from "matter-js";

const opts = {
  isStatic: true,
  friction: 2,
};

export function makeWalls(conainerBounding, engine, wallOptions) {
  var Bodies = Matter.Bodies;

  let bottom, top, wLeft, wRight;

  if (wallOptions.bottom) {
    bottom = Bodies.rectangle(
      conainerBounding.width / 2,
      conainerBounding.height + 50,
      conainerBounding.width + 100,
      100,
      opts
    );
    Matter.World.add(engine, bottom);
  }
  if (wallOptions.top) {
    top = Bodies.rectangle(
      conainerBounding.width / 2,
      -50,
      conainerBounding.width + 100,
      100,
      opts
    );
    Matter.World.add(engine, top);
  }
  if (wallOptions.right) {
    wRight = Bodies.rectangle(
      conainerBounding.width + 50,
      conainerBounding.height / 2,
      100,
      conainerBounding.height,
      opts
    );
    Matter.World.add(engine, wRight);
  }
  if (wallOptions.bottom) {
    wLeft = Bodies.rectangle(
      -50,
      conainerBounding.height / 2,
      100,
      conainerBounding.height,
      opts
    );
    Matter.World.add(engine, wLeft);
  }
}
