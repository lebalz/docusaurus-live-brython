---
sidebar_position: 1
sidebar_label: API
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import BrowserWindow from '@site/src/components/BrowserWindow';



### 唯讀模式 (readonly)

您可以透過添加 `readonly` 元數據字串來使編輯器變為唯讀模式。

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

:::tip[與持久化代碼一起使用]
當代碼被持久化時，仍然會應用唯讀模式。

<details>
<summary>使用案例: 學校的老師</summary>

這在學校的上下文中特別有用，其中一些練習/考試只能在給定的時間內完成，但您希望對提交的解決方案進行反饋。然後添加 `readonly` 屬性，學生可以看到他們的編輯，但無法編輯它們。

是的，這只有在您修改 `Store.tsxt`/`Storage.ts` 組件/腳本並引入與服務器後端的自定義連接時才能安全工作，其中代碼被存儲和提取。

</details>
:::

### 隱藏下載按鈕 (noDownload)

您可以通過添加 `noDownload` 元數據字串來隱藏下載按鈕。

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

### 隱藏比較按鈕 (noCompare)

每當對代碼進行更改時，您可以與原始代碼進行比較。您可以通過添加 `noCompare` 元數據字串來隱藏比較按鈕。

````md
```py live_py noCompare
print('Hello No Compare Button')
```
````

<BrowserWindow>
進行一些更改並注意比較按鈕沒有顯示。

```py live_py noCompare
print('Hello No Compare Button')
```
</BrowserWindow>

### 隱藏重置按鈕 (noReset)

重置按鈕允許您將代碼重置為原始代碼。您可以通過添加 `noReset` 元數據字串來隱藏重置按鈕。

````md
```py live_py noReset
print('Hello No Reset Button')
```
````

<BrowserWindow>

編輯代碼並注意重置按鈕被隱藏。

```py live_py noReset
print('Hello No Reset Button')
```
</BrowserWindow>

### 滾動前的最大行數 (maxLines)

您可以指定在編輯器滾動之前的最大行數。這對於長代碼片段很有用。預設值為 `25`。

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

### 輸入

預設情況下，位於 `static/bry-libs/` 目錄中的所有 Python 腳本都可以直接從代碼區塊中導入。這使您可以創建可重用的模塊，並將其導入到您的代碼區塊中。

在運行開發服務器時，腳本 `grid.py` 預設添加到 `static/bry-libs/grid.py` 中。

<details>
<summary>`grid.py` 的內容</summary>

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

### 持久化變更 (id)

您可以通過為代碼區塊添加 `id` 來持久化編輯器中的變更。這些變更將存儲在本地儲存中，並且當頁面重新加載時，內容將會恢復。

````md
```py live_py id=example
# 此代碼區塊中的變更將被存儲在本地儲存中
```
````

<BrowserWindow>

```py live_py id=example
# 此代碼區塊中的變更將被存儲在本地儲存中
```

</BrowserWindow>

:::warning[唯一 ID]
確保整個網站上的 ID（不僅僅是這一頁）是唯一的，否則用戶可能會遇到意外的行為。（代碼將被具有相同 ID 的最後一個變更的代碼區塊覆蓋）。
:::
:::tip[UUID]
確保唯一 ID 的一個好方法是使用 UUID。對於 VS Code 用戶，擴展 [UUID Generator by Motivesoft](https://marketplace.visualstudio.com/items?itemName=motivesoft.vscode-uuid-generator) 可以輕鬆插入新的 UUID，使用快捷鍵 `Alt+Shift+U`。
:::

### 保存版本 (versioned)

您可以通過添加 `versioned` 元數據字串來保存代碼的版本。這將為編輯器添加版本歷史。每次更改都會保存為新版本，但每秒不超過一次（可以通過 `docusaurus.config.js` 中的 `syncMaxOnceEvery` 選項進行配置）。

````md
```py live_py versioned id=fe506dd7-1507-4929-ad07-302d22529d79
print('Hello Versioned Mode')
```
````

<BrowserWindow>

嘗試更改代碼，然後點擊版本歷史詳細信息。
```py live_py versioned id=fe506dd7-1507-4929-ad07-302d22529d79
print('Hello Versioned Mode')
```
</BrowserWindow>

:::warning[僅在持久化模式下]
版本模式僅在與 `id` 屬性一起使用時有效。`id` 屬性用於將版本存儲在本地儲存中。
:::

### 隱藏版本歷史 (noHistory)

您可以通過添加 `noHistory` 元數據字串來隱藏版本歷史。這只會隱藏歷史記錄，對 `versioned` 屬性沒有影響。

````md
```py live_py versioned noHistory
print('Hello No History')
```
````

## 配置

```js title=docusaurus.config.js
export default {
  themes: [
    [
      'theme-live-codeblock',
      {
        /**
         * brython 源文件的路徑。
         * @default 'https://raw.githack.com/brython-dev/brython/master/www/src/brython.js'
         */
        brythonSrc: string;
        /**
         * brython 標準庫源文件的路徑。
         * @default 'https://raw.githack.com/brython-dev/brython/master/www/src/brython_stdlib.js'
         */
        brythonStdlibSrc: string;
        /**
         * brython 特定庫的資料夾路徑。
         * 當 Python 文件導入模塊時，該模塊將在
         * `libDir` 目錄中查找。
         * 默認情況下，libDir 會在靜態資料夾中創建，並將所需的
         * Python 文件複製到那裡。這可以通過將 
         * `skipCopyAssetsToLibDir` 設置為 true 並將 libDir 設置為自定義路徑來更改。
         * 請確保將所需的 Python 文件複製到自定義 libDir。
         * @default '/bry-libs/'
         */
        libDir: string;
        /**
         * 跳過將 brython 特定庫複製到 `libDir`。
         * 請確保自行將所需的 Python 文件複製到自定義 libDir。
         * @ref [所需的 Python 文件](https://github.com/lebalz/docusaurus-live-brython/tree/main/src/assets)
         * @default false
         */
        skipCopyAssetsToLibDir: boolean;
        /**
         * 指定等待的時間（以毫秒為單位），以在將當前變更同步到本地存儲之前等待。
         * 這有助於防止每次按鍵時都存儲代碼。
         * @default 1000
         */
        syncMaxOnceEvery: number;  
      }
    ]
  ],
};
```