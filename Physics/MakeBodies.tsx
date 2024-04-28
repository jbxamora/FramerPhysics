import Matter from "matter-js";

export function makeBodies(
  container,
  world,
  elements,
  frictionOpts,
  densityOpts
) {
  const conainerBounding = container.getBoundingClientRect();
  let stack = Matter.Composites.stack(
    0,
    0,
    elements.length,
    1,
    0,
    0,
    (xx, yy, i) => {
      const { x, y, width, height } = elements[i].getBoundingClientRect();

      var maxLeft = conainerBounding.width - width;
      var maxTop = conainerBounding.height - height;

      // Places the elements at random locations
      // Could be expanded to allow control of body placement from property controls
      var tLeft = Math.floor(Math.random() * maxLeft),
        tTop = Math.floor(Math.random() * maxTop);

      return Matter.Bodies.rectangle(tLeft, tTop, width, height, {
        isStatic: false,
        density: densityOpts.enable ? densityOpts.density : 0,
        friction: frictionOpts.friction,
        frictionAir: frictionOpts.frictionAir,
      });
    }
  );

  Matter.World.add(world, stack);

  return stack;
}
