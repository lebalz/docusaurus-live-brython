
from browser import timer, document # type: ignore
from config import Config           # type: ignore

import time
class Game():
    stop_request = False
    anim_id = None
    timeout_id = None
    init_time = None
    sleep_requested: bool = False

    @staticmethod
    def reset():
        Game.stop_request = False
        Game.anim_id = None
        Game.timeout_id = None
        Game.init_time = None
        Game.sleep_requested = False

    @staticmethod
    def sleep(ms):
        pass

    @staticmethod
    def stop():
        Game.stop_request = True
        timer.clear_timeout(Game.timeout_id)
        timer.cancel_animation_frame(Game.timeout_id)

    @staticmethod
    def is_running():
        return not Game.stop_request and document[Config.BRYTHON_COMMUNICATOR].attrs.get('data--start-time') == Game.init_time # type: ignore

def sleep(ms):
    Game.sleep(ms)

def stop():
    Game.stop()

def gameloop(func):
    '''
    Wrapper function for brython

    ## Example
    ```py
    from game import gameloop, sleep, stop

    @gameloop
    def run(dt):
        print('Time', dt)
        if dt > 2000: # stop the game loop after 2000 ms 
            stop()
        sleep(100) # sleeps 100 ms

    
    run()
    ```
    '''
    Game.reset()
    t0 = time.now() # type: ignore
    Game.init_time = document[Config.BRYTHON_COMMUNICATOR].attrs.get('data--start-time')
        
    def animation_frame():
        Game.anim_id = timer.request_animation_frame(lambda t: wrap(t))

    def sleep(ms):
        Game.sleep_requested = True
        if Game.is_running():
            Game.timeout_id = timer.set_timeout(animation_frame, ms)

    Game.sleep = sleep
    
    def wrap(*args, **kwargs):
        Game.sleep_requested = False
        if func.__code__.co_argcount > 0:
            result = func(time.now() - t0) # type: ignore
        else:
            result = func()

        if not Game.sleep_requested and not Game.stop_request:
            animation_frame()
        return Game
    return wrap