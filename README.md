# Contra - Component Randomizer

---

[REMIX LINK](https://framer.com/projects/new?duplicate=Eagbym5lAHELXLdc5PFI&via=twyne) - Gather Random

[REMIX LINK](https://framer.com/projects/new?duplicate=2BRawnoMB57wXPaxar6V&via=twyne) - Shuffle on Page Load

<aside>
💡 As we navigate through each version's development, this guide emphasizes the practical application, challenges encountered, and solutions implemented. It serves as both a technical case study and a practical guide for developers looking to understand or replicate this process in their projects.

</aside>

# 

Table of Contents

# User Story

> **AS A** website visitor,
> 
> 
> **I WANT** to see a ***different*** and playful arrangement of elements like flowers, body parts, graffiti tools, and french fries in the website's header every time I visit,
> 
> **SO THAT** the website always feels fresh, engaging, and tailored to the site owner’s unique personality.
> 

### Acceptance Criteria

- [x]  **`Surprise Me:`**
    - `~~Each time I visit the website, I should be greeted with a new, random mix of cool elements floating around the header. It’s like a little surprise party that starts my journey on the site.~~`
- [x]  **`Let Me Play:`**
    - `~~I’d love to be able to click on and interact with these elements. Maybe they can bounce around or float away when I touch them. It makes the site fun to visit.~~`
- [x]  **`Fresh Looks:`**
    - `~~It’s great if new elements can be added over time. Keeps things interesting for me when I come back.~~`

# Original Component

[Original Component](Variations/Original%20Component%20ca891a003a454d14aa5bb485589f932b.md)

It's designed for use in environments that support custom React components, such as Framer, to enhance user interfaces with dynamic and interactive elements governed by physics laws. Here's a breakdown of what this component does:

## Initialization

- **Matter.js Setup:** At the start, it initializes a physics engine using Matter.js. This engine is responsible for simulating physics interactions and behaviors like gravity and collisions.
- **Gravity Control:** Users can set the gravity's X and Y components via component properties, affecting how objects within this physics environment behave.
- **Engine and World Creation:** Creates a physics engine and world, setting up gravity based on the provided properties. It also configures whether bodies can sleep to improve performance.

### Dynamic Content and Interactivity

- **Dynamic Walls:** Based on the `wallOptions` prop, invisible walls can be added around the container to contain or bounce back the physics bodies.
- **Mouse Interactions:** If enabled, users can interact with the physics bodies using their mouse or touch input, thanks to a `MouseConstraint`. This allows for dragging, and the responsiveness can be adjusted through stiffness and angular stiffness settings.
- **Body Creation and Placement:** Utilizes custom functions (`makeWalls`, `makeBodies`) to create physics bodies and walls within the physics world. These bodies correspond to the child elements of the component, allowing for dynamic creation and manipulation based on the content passed into the component.

### Rendering and Style

- **Custom Rendering Loop:** A rendering loop updates the position and rotation of each body to reflect its physical state, making the DOM elements move according to the physics simulation.
- **Style and Visibility:** Initially, child elements are set to be invisible and are made visible once they are positioned by the physics engine, ensuring a clean initial appearance.

### Customization and Property Controls

- **Framer Property Controls:** The code includes property controls for Framer, allowing users to customize aspects like gravity, walls, friction, mouse interaction, and density through Framer's UI without touching the code.
- **Debugging and Performance Options:** Offers a debug mode to visualize physics interactions and a 'sleeping' option to improve performance by allowing non-moving bodies to sleep.

### Use Case

This component is particularly useful for creating interactive, physics-driven experiences on web pages or applications, enhancing user engagement through playful and dynamic interactions. It allows developers to easily integrate physics into their UIs without deep knowledge of physics engines, providing a high degree of customization to fit the needs of the project.

# Variation: Center Gather (Working)

[Gather Center - Physics Component Variation (Working)](Variations/Gather%20Center%20-%20Physics%20Component%20Variation%20(Worki%209551de63afd84833b53685d891e5e480.md)

This snippet introduces several key differences from the original Physics component, primarily focusing on the physics simulation behavior and component lifecycle management:

## **Gravity Configuration**

Unlike the original, which allows for customizable gravity settings via **`props.gravY`** and **`props.gravX`**, this version sets gravity to zero for both axes at the engine's creation. This change emphasizes the central attraction force as the primary influence on the bodies, creating a zero-gravity environment that contrasts with potentially variable gravity settings in the original.

## **Central Attraction Forces**

This version introduces the **`applyCenterAttractionForces`** function, which is not present in the original. This function applies a constant force towards the center of the container for all dynamic bodies, creating a unique interaction pattern that draws elements towards a central point. This feature adds a dynamic visual effect and interaction possibility not contemplated in the original setup.

## **Interval for Force Application**

It establishes an interval that periodically applies the central attraction forces to the bodies within the simulation. This continual application is necessary to maintain the desired central pulling effect and is a notable addition that alters the simulation's behavior over time, diverging from the original's static gravity influence.

## **Cleanup on Component Unmount**

The introduction of a cleanup mechanism (**`return () => clearInterval(forceInterval)`**) upon component unmount is a crucial difference. This cleanup ensures that the interval applying the central attraction forces is cleared, preventing potential memory leaks and performance issues. The original code does not provide explicit cleanup for intervals or event listeners, which could lead to resource management issues in long-running applications.

These modifications shift the focus from a general physics simulation framework, as seen in the original, to a more specialized setup designed to simulate a zero-gravity environment with central attraction forces. This change could significantly impact the user experience and visual presentation of the components within the Physics environment, offering a more focused and controlled interaction pattern.

### Errors Encountered

- [x]  `“cannot read undefined reading length”`Component children get reset after changing functionality; Re-add props to component in Framer Editor.
- [x]  `“minified error”`After debugging we realized there was multiple physics components stacked on top of each other causing this error.

---

## VARIATION DEMO

[CentralGather.mp4](Variations/CentralGather.mp4)

---

# Variation 2: Randomizer (Debugging)

[Randomizer v3](Variations/Randomizer%20v3%204ad3d342d6f04752a59b5ca8f45f186c.md)

This snippet introduces several modifications and additions to the original Physics component, enhancing its functionality and interactivity in a web environment. Here's a comparison to the original highlighting the key differences:

### **Random Selection of Children**

- **Original:** The first version doesn't include logic for randomly selecting different sets of children elements to be displayed.
- **Modified:** Introduces a mechanism to randomly select a set of children (**`childrenSet1`**, **`childrenSet2`**, **`childrenSet3`**) upon component mounting. This adds a layer of dynamism to the component, ensuring that the displayed elements can vary with each component instantiation, making each user experience unique.

### **Central Attraction Forces**

- **Original:** No specific functionality is provided to apply forces to the bodies in the physics world.
- **Modified:** Implements **`applyCenterAttractionForces`** function, which applies a central attraction force to all non-static bodies in the physics world. This creates a visually appealing effect where elements are gently pulled towards the center of their container, enhancing the interactive experience.

### **Gravity Adjustment and Component State**

- **Original:** Sets up gravity based on provided props and initializes the physics engine directly within a **`React.useEffect`** hook without using React state or refs for the engine instance.
- **Modified:** Specifically sets gravity to zero in both axes (**`x`** and **`y`**) during engine creation to facilitate the central attraction effect without the influence of external gravity. Uses a ref (**`engine.current`**) to store the engine instance, ensuring that it persists across re-renders without reinitialization.

### **Interval for Force Application**

- **Modified:** Introduces an interval (**`forceInterval`**) that repeatedly applies the central attraction forces to the bodies. This continuous application is necessary to maintain the central pulling effect, especially as bodies move and interact within the container.

### **Enhanced Property Controls**

- **Modified:** Adds property controls for the three sets of children (**`childrenSet1`**, **`childrenSet2`**, **`childrenSet3`**), allowing for the dynamic selection mechanism. This provides the user with the ability to define multiple groups of elements in Framer, offering greater flexibility in how the physics interactions can be experienced.

### **Key and Draggable Attributes**

- **Modified:** Adjusts the rendering logic to include a **`key`** prop for each child element, improving React's ability to efficiently manage the list of elements. Also, it toggles the **`draggable`** attribute based on the element's context, which could affect how user interactions are handled.

### **Visibility and Style Adjustments**

- **Modified:** Changes the visibility style of the bodies from "hidden" to "visible", reflecting a different approach in how and when the elements are shown during the physics simulation.

These changes collectively enhance the component's interactivity, visual appeal, and user experience by introducing variability in the displayed content and adding a central attraction force that affects the motion of the elements.

### Errors Encountered

- [x]  `“cannot read undefined reading length”`Component children get reset after changing functionality; Re-add props to component in Framer Editor.
- [x]  `Component Runs but isn’t visible`Published test site and confirmed that 3 different sets of children were loaded at separate times. We confirmed this through the network tab using Chrome Dev Tools. Changed visibility from hidden to visible in component code.
- [x]  Children are now visible and refresh but are no longer interactive.

### ~~Current State Demo~~

[RandomizeV7.MP4.mov](Variations/RandomizeV7.MP4.mov)

---

> Trying a different approach with this one.
> 

---

# Variation 3: Randomizer (Different Method)

[Randomizer v4 (unstable)](Variations/Randomizer%20v4%20(unstable)%20f8f8fd45f06c42519f15f597dfa025bb.md)

## ~~What’s New~~

~~Here are the key differences:~~

1. **~~Dynamic Selection of Child Sets:** This version introduces a state (**`childIndex`**) managed by React's **`useState`** hook, which is used to randomly select one of the three sets of children (**`childrenSet1`**, **`childrenSet2`**, **`childrenSet3`**) at the component's initialization. This approach adds a layer of dynamic content presentation not present in the earlier versions, as it allows for the display of different content sets on each component mount, enhancing the variability and freshness of the user experience.~~
2. **~~State Management:** The use of React's **`useState`** for managing which set of children to display is a new addition. Previous versions did not utilize React state for dynamic content management, focusing instead on physics interactions and properties configuration.~~
3. **~~Simplified Children Handling:** Unlike the second version, which involved a more complex mechanism for random selection and dynamic handling of multiple sets of children with the use of additional effects and states, this version simplifies the process. It directly uses the **`useState`** hook to determine the index of the children set to display, streamlining the component's logic and making it more understandable and maintainable.~~
4. **~~Fallback for No Children Sets:** This version provides a fallback UI (**`<div>No children set X</div>`**) for each of the children sets if they are not provided. This ensures that the component always has a controlled behavior and display, even when the expected props are not passed, improving the robustness and user experience of the component.~~
5. **~~Gravity and Physics Interactions:** While maintaining the core physics functionalities, such as the application of central attraction forces and the configuration of the physics engine (zero gravity, mouse interactions, and wall creation), this version focuses more on the content presentation aspect by dynamically selecting which set of children to display. The physics interactions remain consistent with previous versions, ensuring that the unique interactive experience is preserved.~~
6. **~~Component Cleanup:** This version continues to emphasize the importance of cleanup on component unmount by clearing the interval set for applying central attraction forces. This consistent approach across versions highlights the attention to performance and resource management in interactive components.~~

### ~~Current Randomizer (Unstable)~~

[Updated Randomizer](Variations/Updated%20Randomizer%203a6e1b4fa92e4d5897b3fec079c5720e.md)

[GatherRandom.mp4](Variations/GatherRandom.mp4)

~~Trying a different method.~~

# Randomize Physics Components

[Working Randomizer](Variations/Working%20Randomizer%20fba3b2fe323f4d1787e86c6060a6f085.md)

[Working Randomizer w Center Gather Effect](Variations/Working%20Randomizer%20w%20Center%20Gather%20Effect%207890ecb526d441b6bc973d5ea315b4dd.md)

## Overview

In the latest iteration of the Physics component, an essential enhancement was introduced to optimize how sets of children are dynamically shuffled and displayed. This document outlines the rationale, implementation, and benefits of the updated shuffling method, ensuring a clearer understanding of the changes and their impact on the component's functionality.

## Rationale

The initial method for shuffling between children sets was straightforward but lacked efficiency and adaptability. It relied on a static selection mechanism tied closely to the component's mounting phase, which could result in limited flexibility and potential redundancy in code execution. The aim was to refine this process to ensure a more dynamic, efficient, and maintainable approach to selecting and displaying children sets.

## Implementation

### Selecting Child Sets

The new method introduces a stateful approach to manage the selection of children sets. Upon component initialization or a change in props, a function `selectChildSet` is triggered to randomly select one of the available children sets. This selection is stored in a state variable `childSet`, which the component then uses to render the appropriate set of children.

```tsx
function selectChildSet() {
    const sets = [props.childrenSet1, props.childrenSet2, props.childrenSet3].filter(set => set.length);
    const randomIndex = Math.floor(Math.random() * sets.length);
    setChildSet(sets[randomIndex] || []);
}

```

This method filters out any empty sets to ensure that only viable sets are considered for selection. It dynamically adapts to the provided sets, enhancing the component's flexibility.

### State Management

The use of React's `useState` hook for managing `childSet` allows for dynamic updates and re-rendering of the component based on the selected set of children. This approach replaces the static, one-time selection mechanism, offering improved adaptability and responsiveness to prop changes.

## Benefits

- **Dynamic Flexibility:** The component can now dynamically shuffle and select from multiple sets of children based on the current props, enhancing its adaptability.
- **Efficiency:** By filtering out empty sets and selecting from viable options, the method ensures that only meaningful updates are made to the component's state, improving its efficiency.
- **Maintainability:** The clear separation of concerns and the use of state management for child set selection simplify the component's logic, making it easier to maintain and extend.

## Working Randomizer Demo

[RandomizerComponent.mp4](Variations/RandomizerComponent.mp4)

## Working Randomizer Demo (Center Gather Effect)

[CenterGatherRandom.mp4](Variations/CenterGatherRandom.mp4)

## Conclusion

The optimized method for shuffling between sets of children in the Physics component introduces significant improvements in flexibility, efficiency, and maintainability. By adopting a dynamic and stateful approach, the component now offers enhanced performance and adaptability, ensuring a smoother and more engaging user experience.

## MakeBodies.tsx Update

MakeBodies.tsx now sets the initial position of the “bodies” outside of the 
container.

```
import Matter from "matter-js"

export function makeBodies(
    container,
    world,
    elements,
    frictionOpts,
    densityOpts
) {
    const containerBounding = container.getBoundingClientRect()
    let stack = Matter.Composites.stack(
        0,
        0,
        elements.length,
        1,
        0,
        0,
        (xx, yy, i) => {
            const { width, height } = elements[i].getBoundingClientRect()

            // Set initial positions outside the container's visible area
            // Choose randomly to position either to the left/right or above/below the container
            var outsidePosition =
                Math.random() < 0.5
                    ? {
                          // Position to the left or right
                          x:
                              Math.random() < 0.5
                                  ? -width - 5
                                  : containerBounding.width + 5,
                          y: Math.floor(
                              Math.random() * containerBounding.height
                          ),
                      }
                    : {
                          // Position above or below
                          x: Math.floor(
                              Math.random() * containerBounding.width
                          ),
                          y:
                              Math.random() < 0.5
                                  ? -height - 5
                                  : containerBounding.height + 5,
                      }

            return Matter.Bodies.rectangle(
                outsidePosition.x,
                outsidePosition.y,
                width,
                height,
                {
                    isStatic: false,
                    density: densityOpts.enable ? densityOpts.density : 0,
                    friction: frictionOpts.friction,
                    frictionAir: frictionOpts.frictionAir,
                }
            )
        }
    )

    Matter.World.add(world, stack)

    return stack
}

```