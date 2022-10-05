# boxes2 (it's read bouxsesdva)

## Goals

Do it in pure javascript. Do not use jQuery, Underscore and such.

Maintain project with vite.

### Goal 1

The goal is to dynamically create a grid of X*Y tile elements that can be clicked. When clicked the element changes color from white to green.

The grid needs to be constrained to x (rows < 200) and y (columns < 8).

### Goal 2
A green element is a selected element.

When all elements are selected a process of deselecting every tile begins. The direction of the "deselection" is dependant on the FIFO (first in first out) or FILO(first in last out) selector.

### Goal 3
The delay at which they are "deselected" is in ms and is dependant on the delay field.

### Goal 4
Quality of life improvements:

- If a user has focus in one of the grid inputs, they can press enter and DRAW will be activated
- Boxes can be changed into circles, on the fly!
- Show a notification when certain events occur (drawing grid, emptying selected items, faulty input ... )
- Button to manually unload the items

## Installation
Clone this and then do 
```
npm install
```

And after that 
```
npm run dev
```

Profit!
