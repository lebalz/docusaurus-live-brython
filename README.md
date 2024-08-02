# Docusaurus Live Codeblock for Python

[![NPM Version](https://img.shields.io/npm/v/docusaurus-live-brython)](https://www.npmjs.com/package/docusaurus-live-brython/)


> [!NOTE]\
> This theme works with Docusaurus v3+.


> [!WARNING]
> This theme is still in development and the api is not considered stable in the beta phase.

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

Configure [👉 Brython source](https://github.com/brython-dev/brython):


```diff
module.exports = {
  ...
+ themes: [
+   ['docusaurus-live-brython'],
+   {
+     brythonSrc: 'https://cdn.jsdelivr.net/npm/brython@3.12.4/brython.min.js', // default
+     brythonStdlibSrc: 'https://cdn.jsdelivr.net/npm/brython@3.12.4/brython_stdlib.js' // default
+   }
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


# Development

Ensure to locally link the plugin to the website, s.t. changes take place immediately.

To compile and copy the changed `.css` files to the `lib` folder, run
```sh
yarn run watch
```

To see the changes within docusaurus, launch the documentation website located under `website/`.

Initially link the plugin to the website (only needed once)
```sh
# in the project root
yarn link

cd website

yarn link docusaurus-live-brython
```

Then start the website
```sh
yarn run start
```

### Publish

```bash
yarn run build
# when running inside wsl, use --auth=legacy
npm login --auth=legacy
npm publish --auth=legacy
```
