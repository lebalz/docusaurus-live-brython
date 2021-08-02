import * as React from 'react';
import { DOM_ELEMENT_IDS } from './constants';
import { sanitizePyScript } from '../utils/sanitizers';
const run_template = require("./brython_runner.raw.py")

export default function PyScriptSrc({ codeId, pyScript }) {
    return (
        <script id={DOM_ELEMENT_IDS.scriptSource(codeId)} type="text/py_disabled" className="brython-script">
            {`${run_template}\nrun("""${sanitizePyScript(pyScript)}""", '${codeId}')`}
        </script>
    )
}