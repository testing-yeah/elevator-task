# Elevator System Task

## Requirements

### 1. Building Setup
- The building has 10 floors (including ground floor) and 5 elevators.

### 2. Elevator Call Button
- Near each floor, present a green button to call an elevator.

### 3. Calling an Elevator
- Change the “call” button to red, and change the text to “waiting”.
- Identify the closest elevator to the floor, and send the elevator to that floor.
    - There's a chance all the elevators will be occupied at that moment.
    - Do not miss any calls (use a queue?).
  
### 4. Elevator Movement
- The elevator should move toward the selected floor in a smooth movement.
- Measure the time it took the elevator to reach the designated floor.
- Change the elevator color to red.

### 5. Elevator Reached the Floor
- Make a sound when the elevator reaches the floor.
- Change the elevator color to green.
- Wait 2 seconds before moving to the next call (if any).
- Change the button text to “arrived” and adjust the design according to the following specifications.
  
### 6. After 2 Seconds
- After 2 seconds, change the elevator color back to black, and change the button text to “call”, reverting to the initial design.

## Objective
The purpose of this exercise is to test the infrastructure and the design of your code. The solution should also work as expected.

### Note:
- This work needs to be done as soon as possible.
- **Do not use any AI tools**.

### Reference:
[Elevator System Example](https://elevator-exercise.vercel.app/)

## Technology Stack
- Vanilla (Native JS)
- React JS
