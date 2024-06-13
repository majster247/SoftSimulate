# Soft Body Simulation in JS
## Overview

This project is a JavaScript-based simulation of a soft body using the Verlet integration method. The goal is to model the behavior of a soft body under various forces and constraints, making it appear and react in a realistic manner. This simulation is inspired by concepts in computational physics and demonstrates the practical application of numerical methods in simulating physical systems.

### [Live Demo](https://majster247.github.io/SoftSimulate/)

## Mathematical Concepts

### Verlet Integration

The Verlet integration method is used to solve the equations of motion. It is particularly well-suited for systems where energy conservation is crucial, like in simulations of physical bodies. The Verlet integration formula is given by:

$$ x(t + \Delta t) = 2x(t) - x(t - \Delta t) + \frac{F(t)}{m} \Delta t^2 $$

where:
- $$$\( x(t) \)$$$ is the position of the point at time \( t \),
- $$\( F(t) \)$$ is the force applied at time \( t \),
- \( m \) is the mass of the point,
- \( \Delta t \) is the time step.

### Hooke's Law

Springs connect the points in the soft body and obey Hooke's Law:

$ F = -k_s (x - x_0) - k_d v $

where:
- \( k_s \) is the spring constant,
- \( k_d \) is the damping constant,
- \( x \) is the current length of the spring,
- \( x_0 \) is the rest length of the spring,
- \( v \) is the velocity difference between the connected points.

### Pressure Forces

The pressure inside the soft body is simulated by applying forces to the boundary points, making the body expand. The pressure \( P \) is gradually increased to a maximum value \( P_{max} \):

$ P = \min(P + 0.01 P_{max}, P_{max}) $

The force due to pressure on a point is proportional to the normal vector at that point and the pressure value:

$ F_{pressure} = n \cdot \frac{P}{V} $

where:
- \( n \) is the normal vector,
- \( V \) is the volume of the soft body.

### Volume Calculation

To apply pressure forces correctly, the volume of the soft body needs to be calculated. This is done using the positions of the points and the normal vectors:

$ V = \sum_{i=1}^{n} \frac{1}{2} (x_i + x_{i+1}) \cdot n_i \cdot d_i $

where:
- \( n \) is the number of points,
- \( x_i \) and \( x_{i+1} \) are the positions of adjacent points,
- \( n_i \) is the normal vector at point \( i \),
- \( d_i \) is the distance between points \( i \) and \( i+1 \).

### Gravity

Gravity is a constant force applied to all points, pulling them downward:

$ F_{gravity} = m \cdot g $

where:
- \( m \) is the mass of the point,
- \( g \) is the acceleration due to gravity.

### Collision Handling

Collision with the ground or other boundaries is handled by applying a restoring force when points exceed the boundaries:

$ F_{collision} = -k_{collision} \cdot (x - x_{boundary}) $

where:
- \( k_{collision} \) is the collision stiffness,
- \( x \) is the position of the point,
- \( x_{boundary} \) is the boundary position.

## How It Works

1. **Initialization**: The simulation initializes the positions, velocities, and forces of points on the soft body. Springs are created between adjacent points to form a mesh structure.

2. **Force Calculation**: Forces due to gravity, spring elasticity, pressure, and collision are calculated. Gravity pulls the points downward, springs attempt to restore points to their rest positions, and pressure forces the body to expand.

3. **Integration**: Using Verlet integration, the new positions of points are computed based on the calculated forces. Velocities are updated by comparing the new and old positions.

4. **Rendering**: The points and springs are rendered on a canvas element, creating a visual representation of the soft body.

5. **Simulation Loop**: The above steps are repeated in a loop, creating a continuous simulation of the soft body's behavior.

## References

- [Symulacje komputerowe w fizyce](https://g.co/kgs/hFc17Nu)
- [Verlet Integration - Wikipedia](https://en.wikipedia.org/wiki/Verlet_integration)

Feel free to explore and modify the code to understand the underlying principles better and create your own soft body simulations!
