import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Brython + Docusaurus = ❤️

Welcome to Live Python in Docusaurus.

With this Theme-Plugin for Docusaurus 3+ you can run Python code snippets in your documentation and can even change the code on the fly. It is the Python-equivalent to Docusaurus' well known [👉 Live Codeblock](https://docusaurus.io/docs/api/themes/@docusaurus/theme-live-codeblock) for JSX.

This theme plugin relys on the awesome [👉 Brython](https://brython.info/index.html)-library written and maintained by [@Pierre Quentel](https://github.com/PierreQuentel), which is a Python 3 implementation for client-side web programming. Brython **transpiles** the written code to Javascript, so it can be executed directly within the browser 🥳.

<details>
<summary>
Known Brython Limitations
</summary>
Of course the transpilation to JS brings some limitations with it:

- No `time.sleep()`
- No "Non-plain" Python Libraries.

Brython is executed in the browser, so it is limited by the browser's capabilities. But still almost anything is possible in Brython as long as you have **pure Python** code - this also applies to libraries. This means too that popular libraries such as *Numpy* or *Pandas* (which rely on `C`-Code) cannot be used.


For more details, see [👉 Brython's documentation](https://brython.info/static_doc/3.12/en/intro.html).
</details>

## Demo

````md
```py live_py
print('Hello World')
```
````

results in

```py live_py
print('Hello World')
```

### Tiny
or for **tiny** code snippets the slim mode can be used:

````md
```py live_py slim
print('Hello Slim Mode')
```
````

```py live_py slim
print('Hello Slim Mode')
```

### Use turtles

Say hello to turtles

```py live_py title=turtle.py
from turtle import *
color('red', 'yellow')
begin_fill()
while True:
    forward(200)
    left(170)
    p = pos()
    if abs(p[0]) < 1 and abs(p[1]) < 1:
        break
end_fill()
```

### Persist code to the local storage

When the container is given an `id` (ensure the id to be unique - the use of `uuid`s is suggested to prevent conflicts), the code will be persisted to the local storage and will be restored when the page reloads.

````md
```py live_py title=persist.py id=brython-code-id
# a persisted code snippet
print('Edit me and see me persist even after page reloads')
```
````

```py live_py title=persist.py id=brython-code-id
# a persisted code snippet
print('Edit me and see me persist even after page reloads')
```

## Installation

To get started, add the theme to your Docusaurus project:

<Tabs>
  <TabItem value="Yarn" label="yarn" default>
        ```bash
        yarn add docusaurus-live-brython
        ```
  </TabItem>
  <TabItem value="npm" label="npm">
        ```bash
        npm install --save docusaurus-live-brython
        ```
  </TabItem>
  <TabItem value="pnpm" label="pnpm">
        ```bash
        pnpm add docusaurus-live-brython
        ```
  </TabItem>
</Tabs>

Then add it to your `docusaurus.config.js`:

```js
export default = {
  ...
// highlight-next-line
+ themes: ['docusaurus-live-brython'],
  ...
}
```