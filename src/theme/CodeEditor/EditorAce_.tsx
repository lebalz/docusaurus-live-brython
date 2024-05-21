import * as React from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { DOM_ELEMENT_IDS } from './constants';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores/hooks';
import Script from '../../models/Script';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/mode-svg';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/webpack-resolver';
// import 'ace-builds/src-noconflict/theme-textmate';
// import('ace-builds/src-noconflict/snippets/python'),

export interface Props {
    webKey: string;
    lang: string;
    showLineNumbers: boolean;
    maxLines?: number;
}

const ALIAS_LANG_MAP_ACE = {
    mpy: 'python',
}

const Editor = observer((props: Props) => {
    const store = useStore('documentStore');
    const pyScript = store.find<Script>(props.webKey);

    const eRef = React.useRef<AceEditor>(null);

    React.useEffect(() => {
        if (eRef && eRef.current) {
            const node = eRef.current;
            if (props.lang === 'python') {
                node.editor.commands.addCommand({
                    // commands is array of key bindings.
                    name: 'execute',
                    bindKey: { win: 'Ctrl-Enter', mac: 'Command-Enter' },
                    exec: () => pyScript.execScript((window as any).__BRYTHON__),
                });
            }
            node.editor.commands.addCommand({
                // commands is array of key bindings.
                name: 'save',
                bindKey: { win: 'Ctrl-s', mac: 'Command-s' },
                exec: () => {
                    pyScript.saveService.saveNow();
                },
            });
            return () => {
                if (node && node.editor) {
                    const cmd = node.editor.commands.commands['execute'];
                    if (cmd) {
                        node.editor.commands.removeCommand(cmd, true);
                    }
                    const save = node.editor.commands.commands['save'];
                    if (save) {
                        node.editor.commands.removeCommand(save, true);
                    }
                }
            };
        }
    }, [eRef, pyScript]);

    return (
        <div className={clsx(styles.brythonCodeBlock, styles.editor)}>
            <AceEditor
                className={clsx(styles.brythonEditor, !props.showLineNumbers && styles.noGutter)}
                style={{
                    width: '100%',
                }}
                onPaste={(e) => {
                    if (pyScript.versioned) {
                        /**
                         * Save and mark pasted content immediately
                         */
                        pyScript.setPastedEdit(true);
                        pyScript.saveService.saveNow();
                    }
                }}
                focus={false}
                navigateToFileEnd={false}
                maxLines={props.maxLines || 25}
                ref={eRef}
                mode={ALIAS_LANG_MAP_ACE[props.lang] ?? props.lang}
                theme="dracula"
                onChange={(value: string) => {
                    pyScript.setData({ code: value });
                }}
                readOnly={pyScript?.showRaw || !pyScript?.loaded}
                value={pyScript?.showRaw ? pyScript.rawScript : pyScript?.data?.code}
                defaultValue={pyScript?.code || '\n'}
                name={DOM_ELEMENT_IDS.aceEditor(pyScript?.codeId)}
                editorProps={{ $blockScrolling: true }}
                setOptions={{
                    displayIndentGuides: true,
                    vScrollBarAlwaysVisible: false,
                    highlightGutterLine: false,
                }}
                showPrintMargin={false}
                highlightActiveLine={false}
                enableBasicAutocompletion
                enableLiveAutocompletion={false}
                enableSnippets={false}
                showGutter={props.showLineNumbers}
            />
        </div>
    );
});
export default Editor;
