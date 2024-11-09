---
image: https://lebalz.github.io/docusaurus-live-brython/img/og_preview.png
---

# Brython Demo

Discover interactive Python code execution with Live Python Playgrounds in your browser, powered by Brython. Perfect for learning and experimenting with ease.

```py live_py
print('Live Brython')

```

## Input Output

```py live_py title=guess.py
from browser import alert
from random import randint 

number = randint(0, 100)
guessed = -1
attempt = 1

while guessed != number:
    guessed = input(f'{attempt} Try: Enter a number from 0 to 100')
    if guessed == '':
        break
    try:
        guessed = int(guessed)
    except:
        alert('Nope, this was not a valid number')
        continue
    attempt += 1
    if guessed == number:
        alert(f'Yay 🥳, you found the number {number} in {attempt} attempt!')
        break
    elif guessed > number:
        alert(f'The entered number {guessed} is too big')
    else:
        alert(f'The entered number {guessed} ist too small')

if guessed==number:
    print(f'you found the number {number} you were looking for in {attempt} attempts. 🥳')
else:
    print(f'The searched number was {number}')
```

## Turtle Graphics

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

## Fractals

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

## Game Loop
Undocumented POC that more complex (cool!) stuff is possible. Check out [Conways Game of Life](https://conwaylife.com/) by running the example below.

```py live_py title=conway.py
from grid import Grid
from game import gameloop, sleep

# initial state
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
