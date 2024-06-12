---
sidebar_position: 2
sidebar_label: Meta-Comments
---

# Meta-Comments

Sometimes you have boilerplate code that you'd like to insert/execute before or after the content of the live code block is executed. This is where meta-comments come in. Meta-comments are comments that are placed within the content of the code block and are used to split the code into `preCode`, `code` and `postCode` parts. `pre-` and `post-` code parts can not be changed by the user, but the `code` part can be edited by the user.

Here's an example of a code block with meta-comments:

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

:::tip[Hover over the code block]
Hover over the code block to see the buttons to expand `preCode` and `postCode` parts of the code block.
:::
