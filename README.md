# Docusaurus Live Codeblock for Python

You can create live code editors with a code block `live_py` meta string.

Install

```bash
npm i docusaurus-live-brython # or yarn add docusaurus-live-brython
```

Modify your `docusaurus.config.js`

```diff
module.exports = {
  ...
+ themes: ['docusaurus-live-brython'],
  presets: ['@docusaurus/preset-classic']
  ...
}
```

## Example:

```py live_py
import turtle
t = turtle.Turtle()
t.width(5) 
t.speed(5)
for c in ['red', '#00ff00', '#fa0', 'rgb(0,0,200)']:
    t.color(c)
    t.forward(100)
    t.left(90)

# dot() and write() do not require the pen to be down
t.penup()
t.goto(-30, -100)
t.dot(40, 'rgba(255, 0, 0, 0.5')
t.goto(30, -100)
t.dot(40, 'rgba(0, 255, 0, 0.5')
t.goto(0, -70)
t.dot(40, 'rgba(0, 0, 255, 0.5')

t.goto(0, 125)
t.color('purple')
t.write("I love Brython!", font=("Arial", 20, "normal"))
```

results in an live editable code block:

![Brython Demo](brython-demo.gif)