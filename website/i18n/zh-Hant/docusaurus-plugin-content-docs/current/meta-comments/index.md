---
sidebar_position: 2
sidebar_label: 元注釋
---

# 元注釋

有時您會有一些樣板代碼，您希望在執行實時代碼塊的內容之前或之後插入或執行。這就是 meta-註解的用途所在。Meta-註解是放置在代碼塊內容中的註解，用於將代碼拆分為 `preCode`、`code` 和 `postCode` 部分。`pre-` 和 `post-` 代碼部分不能被用戶更改，但 `code` 部分可以被用戶編輯。

這是一個帶有 meta-註解的代碼塊示例：

````py
```py live_py
from time import time
t0 = time()
### PRE
def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)
a_5 = fib(27)
### POST
t1 = time()
print(f'Time taken: {t1 - t0:.6f} seconds')
```
````

```py live_py
#
from time import time
t0 = time()
### PRE
def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)
a_5 = fib(27)
### POST
t1 = time()
print(f'Time taken: {t1 - t0:.6f} seconds')
#
```

:::tip[懸停在代碼塊上]
懸停在代碼塊上可以看到按鈕來展開代碼塊的 `preCode` 和 `postCode` 部分。
:::