# Brython + Docusaurus = ❤️

## Hello World

````md
```py live_py
print('Hello World')
```
````

results in

```py live_py
print('Hello World')
```

## With Title


````md
```py live_py title=Your-first_Program
print('Hello Title')
```
````

results in

```py live_py title=Your-first_Program
print('Hello Title')
```

### or

````md
```py live_py title=hello__world.py
print('Hello Underscore')
```
````

results in

```py live_py title=hello__world.py
print('Hello Underscore')
```


## Slim Mode


````md
```py live_py slim
print('Hello Slim Mode')
```
````

results in

```py live_py slim
print('Hello Slim Mode')
```

## Turtles

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
done()
```