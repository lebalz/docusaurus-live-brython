# Brython 範例

```py live_py
print('Live Brython')
```

## 輸入輸出

```py live_py title=guess.py
from browser import alert
from random import randint 

number = randint(0, 100)
guessed = -1
attempt = 1

while guessed != number:
    guessed = input(f'{attempt} 嘗試：請輸入 0 到 100 之間的數字')
    if guessed == '':
        break
    try:
        guessed = int(guessed)
    except:
        alert('錯誤，這不是一個有效的數字')
        continue
    attempt += 1
    if guessed == number:
        alert(f'耶 🥳，你在 {attempt} 次嘗試中找到了數字 {number}!')
        break
    elif guessed > number:
        alert(f'輸入的數字 {guessed} 太大了')
    else:
        alert(f'輸入的數字 {guessed} 太小了')

if guessed == number:
    print(f'你在 {attempt} 次嘗試中找到了你尋找的數字 {number}。🥳')
else:
    print(f'搜尋的數字是 {number}')
```

## 烏龜圖形

```py live_py title=turtles.py
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
done()
```

## 分形

```py live_py title=tree.py
from turtle import *

speed(0)
penup()
goto(0, -200)
pendown()
left(90)
def tree(size):
    if size < 5:
        forward(size)
    else:
        forward(size)
        left(35)
        tree(size / 1.5)
        backward(size / 1.5)
        right(100)
        tree(size / 1.5)
        backward(size / 1.5)
        left(65)
tree(120)
```

## 遊戲循環
未文檔化的概念驗證，展示了更複雜（很酷！）的功能。可以通過運行下面的範例來查看 [Conway's Game of Life](https://conwaylife.com/)。

```py live_py title=conway.py
from grid import Grid
from game import gameloop, sleep

# 初始狀態
grid = Grid.from_text('''
  
 
 
 
 
 
 
 
  
  
  
           xx  xx            
            xx x  
            x  x               
            x  x  
            x xx  
           xx  xx  
           
           
        
        
          
          
          
          
''')

def neighbours(grid, x, y):
    nb = []
    dim_x = len(grid[0])
    dim_y = len(grid)
    for i in range(-1, 2):
        for j in range(-1, 2):
            if not (i == 0 and j == 0):
                ny = (y + i) % dim_y
                nx = (x + j) % dim_x
                nb.append(grid[ny][nx])
    return nb

def live_neighbours(grid, x, y):
    s = 0
    for cell in neighbours(grid, x, y):
        if cell == 'black':
            s += 1
    return s

@gameloop
def evolution(dt):
    current = grid.color_grid
    for x in range(grid.size[1]):
        for y in range(grid.size[0]):
            alive = live_neighbours(current, x, y)
            if current[y][x] == 'black' and 2 <= alive <= 3:
                grid[y][x].color = 'black'
            elif current[y][x] != 'black' and alive == 3:
                grid[y][x].color = 'black'
            else:
                grid[y][x].color = 'white'
    sleep(5)

evolution()
```