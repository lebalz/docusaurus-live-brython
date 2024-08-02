---
sidebar_position: 1
sidebar_label: API
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import BrowserWindow from '@site/src/components/BrowserWindow';

# docusaurus-live-brython

This theme provides a `@theme/CodeEditor` component that is powered by [Brython](https://brython.info/). It allows you to execute and edit Python code blocks directly in your markdown files.
Docusaurus Theme to display markdown code blocks as an executable and editable Brython Live Editor.

[![NPM Version](https://img.shields.io/npm/v/docusaurus-live-brython)](https://www.npmjs.com/package/docusaurus-live-brython/)

## Interactive code editor

(Powered by [Brython](https://brython.info/))

You can create an interactive coding editor with the `docusuaurs-live-brython` plugin. First, add the plugin to your package.


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

You will also need to add the plugin to your `docusaurus.config.js`.

```js
export default {
  // ...
  // highlight-next-line
  themes: ['docusaurus-live-brython'],
  // ...
}
```

To use the plugin, create a code block with `live_py` attached to the language meta string.

````md
```py live_py
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
````

The code block will be rendered as an interactive editor. Changes to the code will reflect on the result panel live when the code is executed.

<BrowserWindow>

```py live_py
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
</BrowserWindow>

## Editor Configuration

| Name         | Default                                | Description                                                |
|:-------------|:---------------------------------------|:-----------------------------------------------------------|
| `title`      | The used Codeblock Language (`PYTHON`) | The title of the code block.                               |
| `id`         | `''`                                   | Persists the changes of the code editor.                   |
| `slim`       | `false`                                | Removes the header and hides the line numbers.             |
| `readonly`   | `false`                                | Makes the editor read-only.                                |
| `versioned`  | `false`                                | Saves versions of the code.                                |
| `noDownload` | `false`                                | Hides the download button.                                 |
| `noCompare`  | `false`                                | Hides the compare button.                                  |
| `noReset`    | `false`                                | Hides the reset button.                                    |
| `noHistory`  | `false`                                | Hides the version history.                                 |
| `maxLines`   | `25`                                   | The maximum number of lines before the editor will scroll. |



### Title (title)

You can add a title to the code block by adding a `title` to the meta string.

:::warning[Spaces]
The space character is not supported, because it is used as a separator in the meta string of a code block. Use an underscore `_` or `-` instead.
:::

````md
```py live_py title=example.py
```
````

:::tip[Use `_` in the title]
To use an underscore, you can use the following syntax:

````md
```py live_py title=example__file.py
```
````

<BrowserWindow>

```py live_py title=example__file.py id=8ba96031-71e6-47dd-be6e-9164761653ee
print('Hello Title')
```
</BrowserWindow>
:::

### Slim Mode (slim)

Sometimes an editor with a header is visually too big. For small code snippets, you can use the `slim` mode to reduce the size of the editor. This will remove the header and hides the line numbers.

````md
```py live_py slim
print('Hello Slim Mode')
```
````

<BrowserWindow>

```py live_py slim
print('Hello Slim Mode')
```
</BrowserWindow>

:::warning[Persistance]
Slim Editor does not support persistance. The `id` attribute is ignored in slim mode.
:::

### Read-Only Mode (readonly)

You can make the editor read-only by adding the `readonly` meta string.

````md
```py live_py readonly
print('Hello Read-Only Mode')
```
````

<BrowserWindow>

```py live_py readonly
print('Hello Read-Only Mode')
```
</BrowserWindow>

:::tip[Works with Persisted Code]
When the code is persisted, the read-only mode is still applied. 

<details>
<summary>Usecase: Teachers in Schools</summary>

This is especially usefull in a School-Context, where some exercises/exams shall be done only during a given time, but you'd like to feedback the handed in solutions. Then the `readonly` attribute is added and the students see their edits, but can't edit it.

Yes, this only works secure if you swizzle the `Store.tsxt`/`Storage.ts` component/script and introduce a custom connection to a server-backend, where the code is stored and fetched from.

</details>
:::

### Hide Download Button (noDownload)

You can hide the download button by adding the `noDownload` meta string.

````md
```py live_py noDownload
print('Hello No Download Button')
```
````
<BrowserWindow>

```py live_py noDownload
print('Hello No Download Button')
```
</BrowserWindow>

### Hide the Compare Button (noCompare)

Whenever changes to the code were made, you can compare with the original code. You can hide the compare button by adding the `noCompare` meta string.

````md
```py live_py noCompare
print('Hello No Compare Button')
```
````

<BrowserWindow>
Make some changes and note that no compare button is shown.

```py live_py noCompare
print('Hello No Compare Button')
```
</BrowserWindow>

### Hide the Reset Button (noReset)

The reset button allows you to reset the code to the original code. You can hide the reset button by adding the `noReset` meta string.

````md
```py live_py noReset
print('Hello No Reset Button')
```
````
<BrowserWindow>

Edit the code and note that the reset button is hidden.

```py live_py noReset
print('Hello No Reset Button')
```
</BrowserWindow>

### Max Line Number before Scroll (maxLines)

You can specify the maximum number of lines before the editor will scroll. This is useful for long code snippets. The default value is `25`.

````md
```py live_py maxLines=5
print('Line 1')
print('Line 2')
print('Line 3')
print('Line 4')
print('Line 5')
print('Line 6 - scrolled')
```
````
<BrowserWindow>

```py live_py maxLines=5
print('Line 1')
print('Line 2')
print('Line 3')
print('Line 4')
print('Line 5')
print('Line 6 - scrolled')
```
</BrowserWindow>

### Imports

By default, all python scripts that are located in the `static/bry-libs/` directory can be imported directly from the code blocks. This allows you to create reusable modules that can be imported into your code blocks.

The script `grid.py` is added by default to `static/bry-libs/grid.py` when you run the dev-server.

<details>
<summary>Content of `grid.py`</summary>

```py
from browser import document # type: ignore
from config import Config # type: ignore

class Rectangle():
    col: int
    row: int
    ctx = None
    grid = None
    init_draw = False
    def __init__(self, grid, col: int, row: int, color: str = ''):
        self.col = col
        self.row = row
        self.grid = grid
        self.init_draw = False
        try:
            canvas = document[Config.CANVAS_ID]
            self.ctx = canvas.getContext('2d')
        except:
            pass
        self._color = color
        
    def get(self, offset_x: int, offset_y: int):
        y = (self.row + offset_y) % len(self.grid) # type: ignore
        x = (self.col + offset_x) % len(self.grid[y]) # type: ignore
        return self.grid[y][x] # type: ignore

    @property
    def color(self):
        return self._color

    @color.setter
    def color(self, color: str):
        if color == '':
            color = 'rgba(0,0,0,0)'

        if self._color == color and self.init_draw:
            return
        self._color = color
        self.init_draw = True
        self.draw()

    def draw(self):
        scale = self.grid.scale # type: ignore
        x = self.col * scale
        y = self.row * scale
        try:
            self.ctx.clearRect(x, y, scale, scale) # type: ignore
            self.ctx.lineWidth = 0 # type: ignore
            self.ctx.fillStyle = self.color # type: ignore
            self.ctx.fillRect(x, y, scale, scale) # type: ignore
        except:
            pass

    def copy(self, grid):
        return Rectangle(grid, self.col, self.row, self.color)

    def __repr__(self):
        return self.color

class RectLine():
    line: list = []
    n = 0
    max = 0
    def __init__(self, grid, row, cols: int | list, color: str = ''):
        self.grid = grid
        if type(cols) == list:
            self.line = cols # type: ignore
        else:
            self.line = [Rectangle(grid, col, row, color) for col in range(cols)] # type: ignore
        self.max = len(self.line) # type: ignore
    
    def __getitem__(self, key):
        return self.line[key]

    def __setitem__(self, key, value):
        self.line[key].color = value

    def __repr__(self):
        return ', '.join([f'{r.color}' for r in self.line])

    def __iter__(self):
        self.n = 0
        return self

    def __next__(self):
        if self.n < self.max:
            result = self[self.n]
            self.n += 1
            return result
        else:
            raise StopIteration
    
    def __len__(self):
        return self.max

    def draw(self):
        for rect in self.line:
            rect.draw()
    
    def copy(self, grid):
        return RectLine(grid, self.line[0].row, [l.copy(grid) for l in self.line]) # type: ignore

class Grid():
    lines = []
    n = 0
    max = 0
    CANVAS_ID = ''
    WIDTH = 500
    HEIGHT = 500
    scale = 10
    record_gif = False
    frames = {}

    def __init__(self, rows: int, cols: int, color: str = '', scale: int = -1):
        if scale < 0:
            if rows > 0 and cols > 0:
                scale = min(Grid.WIDTH // cols, Grid.HEIGHT // rows)
            else:
                scale = 10
        self.scale = scale
        self.lines = [RectLine(self, row, cols, color) for row in range(rows)]
        self.max = rows
    
    @staticmethod
    def setup(width: int, height: int, record_gif: bool = False):
        Grid.HEIGHT = height
        Grid.WIDTH = width
        Grid.record_gif = record_gif
        Grid.frames = {}
        canvas = document[Config.CANVAS_ID]
        parent = canvas.parent
        parent.replaceChildren()
    
        canv = document.createElement('canvas')
        canv.style.display = 'block'
        canv.id = Config.CANVAS_ID;
        canv.attrs['height'] = height
        canv.attrs['width'] = width
        canv.style.width = f'{width}px'
        canv.style.height = f'{height}px'
        parent.appendChild(canv)

    @staticmethod
    def from_bin_text(bin_text: str, colors={'s': 'black', '1': 'black', 'x': 'black', 'bg': ''}):
        lines = bin_text.lower().splitlines()
        if 'bg' not in colors:
            colors['bg'] = ''
        while len(lines) > 0 and len(lines[0]) == 0:
            lines.pop(0)
        size_y = len(lines)
        if size_y < 1:
            raise Exception('Grid must have at least one non empty line')
        size_x = max(map(lambda x: len(x), lines))

        scale = min(Grid.WIDTH // size_x, Grid.HEIGHT // size_y)
        grid = Grid(0, 0, colors['bg'], scale)
        raw_grid = []
        for line in lines:
            raw_line = []
            for x in range(size_x):
                if x < len(line):
                    raw_line.append(Rectangle(grid, x, len(raw_grid), colors.get(line[x], colors['bg'])))
                else:
                    raw_line.append(Rectangle(grid, x, len(raw_grid), colors['bg']))
            raw_grid.append(RectLine(grid, len(raw_grid), raw_line))
        grid.set_lines(raw_grid)
        grid.draw()
        return grid
        

    def set_lines(self, lines):
        self.lines = lines
        self.max = len(lines)

        
    def tolist(self):
        return [[c.color for c in l.line] for l in self.lines]

    @property
    def color_grid(self):
        return self.tolist()

    @property
    def grid(self):
        return self.tolist()

    @property
    def size(self):
        return (self.dim_y, self.dim_x)

    @property
    def dim_x(self):
        if self.max < 1:
            return 0
        return len(self[0])

    @property
    def dim_y(self):
        return len(self.lines)

    @staticmethod
    def clear_canvas():
        try:
            canvas = document[Config.CANVAS_ID]
            ctx = canvas.getContext('2d')
            ctx.clearRect(0, 0, Grid.WIDTH, Grid.HEIGHT) # type: ignore
        except:
            pass


    def draw(self):
        for line in self.lines:
            line.draw()

    @staticmethod
    def gif_add():
        if Grid.record_gif:
            canvas = document[Config.CANVAS_ID]
            frameName = 'frame_' + str(len(Grid.frames)).rjust(3, '0')
            Grid.frames[frameName] = canvas.toDataURL('image/png');



    def fill(self, color: str = ''):
        for line in self.lines:
            for cell in line:
                cell.color = color

    def copy(self):
        cp = Grid(0, 0)
        lines = [l.copy(cp) for l in self.lines]
        cp.set_lines(lines)
        return cp


    def __getitem__(self, key):
        return self.lines[key]

    def __setitem__(self, key, value):
        self.lines[key] = value
        
    def __repr__(self):
        rep = ''
        for line in self.lines:
            rep += f'{line}'
            rep += '\n'
        return rep
    
    def __iter__(self):
        self.n = 0
        return self

    def __next__(self):
        if self.n < self.max:
            result = self[self.n]
            self.n += 1
            return result
        else:
            raise StopIteration

    def __len__(self):
        return self.max
```
</details>

```py live_py title=grid__example.py
from grid import Grid
Grid.clear_canvas()
smile = Grid.from_text('''
       
 x    x
 
 
 
 x    x 
 xxxxxx
 
''')
smile.draw()
```

### Persist Changes (id)

You can persist the changes of the code editor by adding an `id` to the code block. The changes will be stored in the local storage and the content will be restored when the page is reloaded.

````md
```py live_py id=example
# changes made in this code block will be stored in the local storage
```
````

<BrowserWindow>

```py live_py id=example
# changes made in this code block will be stored in the local storage
```

</BrowserWindow>

:::warning[Unique IDs]
Make sure that the IDs on the entire website (not just on this page) are unique, otherwise the behavior may be unexpected for your users. (The code will be overwritten by the last changed code block with the same id).
:::
:::tip[UUID]
A good way to ensure unique IDs is to use a UUID. For VS Code users, the extension [UUID Generator by Motivesoft](https://marketplace.visualstudio.com/items?itemName=motivesoft.vscode-uuid-generator) is handy to insert new UUIDs with `Alt+Shift+U`.
:::



### Save Versions (versioned)

You can save versions of the code by adding the `versioned` meta string. This will add a version history to the editor. Every Change is saved as a new version, but not more than once every 1 second (configurable through the `syncMaxOnceEvery` option in the `docusaurus.config.js`).


````md
```py live_py versioned id=fe506dd7-1507-4929-ad07-302d22529d79
print('Hello Versioned Mode')
```
````
<BrowserWindow>

Try it by changing the code and then clicking on the version history details.
```py live_py versioned id=fe506dd7-1507-4929-ad07-302d22529d79
print('Hello Versioned Mode')
```
</BrowserWindow>

:::warning[Only in Persisted Mode]
The versioned mode only works in combination with the `id` attribute. The `id` attribute is used to store the versions in the local storage.
:::


### Hide the Version History (noHistory)

You can hide the version history by adding the `noHistory` meta string. This will only hide the history, but has no impact on the `versioned` prop.

````md
```py live_py versioned noHistory
print('Hello No History')
```
````


## Configuration

```js title=docusaurus.config.js
export default {
  themes: [
    [
      'theme-live-codeblock',
      {
        /**
         * The path to the brython source file.
         * @default 'https://raw.githack.com/brython-dev/brython/master/www/src/brython.js
         */
        brythonSrc: string;
        /**
         * The path to the brython standard library source file.
         * @default 'https://raw.githack.com/brython-dev/brython/master/www/src/brython_stdlib.js'
         */
        brythonStdlibSrc: string;
        /**
         * The folder path to brython specific libraries.
         * When a python file imports a module, the module is searched in the
         * `libDir` directory.
         * By default, the libDir is created in the static folder and the needed
         * python files are copied there. This can be changed by setting 
         * `skipCopyAssetsToLibDir` to true and setting libDir to a custom path.
         * Make sure to copy the needed python files to the custom libDir.
         * @default '/bry-libs/'
         */
        libDir: string;
        /**
         * Skip copying the brython specific libraries to the `libDir`.
         * Make sure to copy the needed python files to the custom libDir
         * yourself.
         * @ref [needed python files](https://github.com/lebalz/docusaurus-live-brython/tree/main/src/assets)
         * @default false
         */
        skipCopyAssetsToLibDir: boolean;
        /**
         * Specifies the the time in milliseconds to wait before syncing 
         * current changes to the local store.
         * This is useful to prevent storing the code on every key press.
         * @default 1000
         */
        syncMaxOnceEvery: number;  
      }
    ]
  ],
};
```