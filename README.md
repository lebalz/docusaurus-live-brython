# Docusaurus Live Codeblock for Python

## [Live demo here](https://lebalz.github.io/docusaurus-live-brython/)
## [Python-Playground](https://lebalz.github.io/docusaurus-live-brython/playground)

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

## Options

A brython live code block can have additional options in the meta string:

- `title=Some-Text` The title shown in the codeblock header. The title must be unique per page. Single hyphens/underscores (`-` and `_`) are replaced by a space, double hyphens/underscores are replaced with a single hyphen/undescore: `title=Foo-Bar--Bazz` => `Foo Bar-Bazz`; `title=Foo_Bar__Bazz` => `Foo Bar_Bazz`
- `persistent` when added, the reset button will not be shown.
- `slim` displays only the play button, without a header and without the option to persist changes.

# Storage

User edited code is stored in the localStorage. To lookup the edits, id's for each codeblock are generated after the following rules:

- `title` is present -> use a sanitized version as the key.
- `title` is not present -> all codeblocks on the page are enumerated and the index number is used as the key. !! Saved Edits are probably not correctly applied.  
