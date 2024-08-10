import { RouterType } from '@docusaurus/types';
import { DOM_ELEMENT_IDS } from '../constants';
import { sanitizePyScript } from './helpers';

export const runCode = (
    code: string,
    preCode: string,
    postCode: string,
    codeId: string,
    libDir: string,
    router: RouterType,
    cache: boolean = true
) => {
    const lineShift = preCode
        .trim()
        .split(/\n/)
        .filter((l) => l.length > 0).length;
    const pre = lineShift > 0 ? `${preCode.trim()}\n` : '';
    const post = postCode.trim().length > 0 ? `\n${postCode.trim()}` : '';
    const toExec = `${pre}${code}${post}`;
    const src = `from brython_runner import run\nrun("""${sanitizePyScript(toExec || '')}""", '${codeId}', ${lineShift})\n`;
    if (!(window as any).__BRYTHON__) {
        alert('Brython not loaded');
        return;
    }
    const active = document.getElementById(DOM_ELEMENT_IDS.communicator(codeId));
    active!.setAttribute('data--start-time', `${Date.now()}`);
    /**
     * ensure that the script is executed after the current event loop.
     * Otherwise, the brython script will not be able to access the graphics output.
     */
    setTimeout(() => {
        (window as any).__BRYTHON__.runPythonSource(src, {
            pythonpath: router === 'hash' ? [] : [libDir],
            cache: cache
        });
    }, 0);
    return src;
};
