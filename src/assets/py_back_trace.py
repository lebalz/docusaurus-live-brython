from browser import document, window # type: ignore
import sys
import time

# @source https://github.com/brython-dev/brython/blob/master/www/src/Lib/tb.py
# instead of "print()" to "console.log()" in the original code, we use "notify()" to send the output to the react world
# additionally, the line number is shifted by "line_shift" if the user code is wrapped in custom code, e.g. for turtle (@see brython_runner)

def notify(node_id, data):
    event = window.CustomEvent.new('bry_notify', {'detail': data})
    document[f'py_{node_id}'].dispatchEvent(event)

class EventOutput:
    encoding = 'utf-8'

    def __init__(self, node_id, out_type):
        self.node_id = node_id
        self.out_type = out_type
        self.buf = ''

    def write(self, data):
        self.buf += str(data)
        self.flush()

    def flush(self):
        if len(self.buf) > 0:
            notify(self.node_id, {'type': self.out_type, 'output': self.buf, 'time': time.time()})
        self.buf = ''

    def __len__(self):
        return len(self.buf)

class Trace:

    def __init__(self):
        self.lines = []

    def write(self, *data):
        self.lines.append(" ".join([str(x) for x in data]))

    def format(self):
        return '\n'.join(self.lines) + '\n'

def get_formatter(line_shift):
    def format_exc():
        trace = Trace()
        exc_class, exc, tb = sys.exc_info()
        exc_msg = str(exc)

        def handle_repeats(filename, lineno, count_repeats):
            if count_repeats > 0:
                trace_lines = trace.lines[:]
                for _ in range(2):
                    if not filename.startswith('<'):
                        trace.write(trace_lines[-2])
                        trace.write(trace_lines[-1])
                    else:
                        trace.write(trace_lines[-1])
                    count_repeats -= 1
                    if count_repeats == 0:
                        break
                if count_repeats > 1:
                    trace.write(f'[Previous line repeated {count_repeats} ' +
                        f'more time{"s" if count_repeats > 1 else ""}]')

        def show_line():
            line_nr = lineno - line_shift if lineno > 0 else 0
            trace.write(f'  File "{filename}", line {line_nr}, in {name}')
            if not filename.startswith("<"):
                src = open(filename, encoding='utf-8').read()
                lines = src.split('\n')
                line = lines[tb.tb_lineno - 1]
                trace.write(f"    {line.strip()}")

        show = True
        started = False
        save_filename = None
        save_lineno = None
        save_scope = None
        same_line = False
        count_repeats = 0

        while tb is not None:
            if show:
                trace.write("Traceback (most recent call last):")
                show = False
            frame = tb.tb_frame
            code = frame.f_code
            lineno = frame.f_lineno
            name = code.co_name
            filename = code.co_filename
            if filename == save_filename and lineno == save_lineno \
                    and name == save_name:
                count_repeats += 1
                tb = tb.tb_next
                continue
            handle_repeats(save_filename, save_lineno, count_repeats)
            save_filename = filename
            save_lineno = lineno
            save_name = name
            count_repeats = 0
            show_line()
            tb = tb.tb_next

        handle_repeats(filename, lineno, count_repeats)

        if isinstance(exc, SyntaxError):
            trace.write(syntax_error(exc.args))
        else:
            message = exc_msg
            if isinstance(exc, AttributeError):
                suggestion = __BRYTHON__.offer_suggestions_for_attribute_error(exc)
                if suggestion is not None:
                    message += f". Did you mean: '{suggestion}'?"
            elif isinstance(exc, NameError):
                suggestion = __BRYTHON__.offer_suggestions_for_name_error(exc)
                if suggestion is not None:
                    message += f". Did you mean: '{suggestion}'?"
                elif exc.name in __BRYTHON__.stdlib_module_names:
                    message += f". Did you forget to import '{exc.name}'?"
            trace.write(f"{exc_class.__name__}: {message}")

        return trace.format()
    return format_exc

def print_exc(file=None, line_shift=0):
    if file is None:
        file = sys.stderr
    trace = get_formatter(line_shift)()
    file.write(trace)
    return trace

def syntax_error(args):
    trace = Trace()
    info, [filename, lineno, offset, line, *extra] = args
    trace.write(f'  File "{filename}", line {lineno}')
    indent = len(line) - len(line.lstrip())
    trace.write("    " + line.strip())
    nb_marks = 1
    if extra:
        end_lineno, end_offset = extra
        if end_lineno > lineno:
            nb_marks = len(line) - offset
        else:
            nb_marks = end_offset - offset
    nb_marks = max(nb_marks, 1)
    trace.write("    " + (offset - 1) * " " + "^" * nb_marks)
    trace.write("SyntaxError:", info)
    return trace.format()