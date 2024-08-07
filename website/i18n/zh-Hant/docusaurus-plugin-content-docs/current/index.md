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

