import * as React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import { DOM_ELEMENT_IDS } from '@theme/CodeEditor/constants';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/mode-svg';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/webpack-resolver';
import { useStore, useScript } from '@theme/CodeEditor/hooks';
// import 'ace-builds/src-noconflict/theme-textmate';
// import('ace-builds/src-noconflict/snippets/python'),

export interface Props {
    versioned?: boolean;
    showLineNumbers: boolean;
    maxLines?: number;
    onChange?: (code: string) => void;
}

const ALIAS_LANG_MAP_ACE = {
    mpy: 'python'
};

const EditorAce = (props: Props) => {
    const eRef = React.useRef<AceEditor>(null);
    const store = useStore();
    const code = useScript(store, 'code');
    const pristineCode = useScript(store, 'pristineCode');
    const lang = useScript(store, 'lang');
    const codeId = useScript(store, 'codeId');
    const showRaw = useScript(store, 'showRaw');

    React.useEffect(() => {
        if (eRef && eRef.current) {
            const node = eRef.current;
            if (lang === 'python') {
                node.editor.commands.addCommand({
                    // commands is array of key bindings.
                    name: 'execute',
                    bindKey: { win: 'Ctrl-Enter', mac: 'Command-Enter' },
                    exec: () => store.execScript()
                });
            }
            node.editor.commands.addCommand({
                // commands is array of key bindings.
                name: 'save',
                bindKey: { win: 'Ctrl-s', mac: 'Command-s' },
                exec: () => {
                    store.saveNow();
                }
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
    }, [eRef, lang, store]);

    return (
        <div className={clsx(styles.editor)}>
            <AceEditor
                className={clsx(styles.brythonEditor, !props.showLineNumbers && styles.noGutter)}
                style={{
                    width: '100%',
                    lineHeight: 'var(--ifm-pre-line-height)',
                    fontSize: 'var(--ifm-code-font-size)',
                    fontFamily: 'var(--ifm-font-family-monospace)'
                }}
                fontSize={'var(--ifm-code-font-size)'}
                onPaste={() => {
                    if (props.versioned) {
                        /**
                         * Save immediately as pasted content
                         */
                        store.setIsPasted(true);
                    }
                }}
                focus={false}
                navigateToFileEnd={false}
                maxLines={props.maxLines || 25}
                ref={eRef}
                mode={ALIAS_LANG_MAP_ACE[lang as keyof typeof ALIAS_LANG_MAP_ACE] ?? lang}
                theme="dracula"
                onChange={(value: string, e: { action: 'insert' | 'remove' }) => {
                    store.setCode(value, e.action);
                    if (props.onChange) {
                        props.onChange(value);
                    }
                }}
                readOnly={showRaw}
                value={showRaw ? pristineCode : code}
                defaultValue={code || '\n'}
                name={DOM_ELEMENT_IDS.aceEditor(codeId)}
                editorProps={{ $blockScrolling: true }}
                setOptions={{
                    displayIndentGuides: true,
                    vScrollBarAlwaysVisible: false,
                    highlightGutterLine: false
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
};
export default EditorAce;
