import * as React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import { DOM_ELEMENT_IDS } from './constants';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/mode-svg';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/webpack-resolver';
import { useScript } from './WithScript';
// import 'ace-builds/src-noconflict/theme-textmate';
// import('ace-builds/src-noconflict/snippets/python'),

export interface Props {
    versioned?: boolean;
    showLineNumbers: boolean;
    maxLines?: number;
}

const ALIAS_LANG_MAP_ACE = {
    mpy: 'python',
}

const Editor = (props: Props) => {
    const script = useScript();
    const eRef = React.useRef<AceEditor>(null);

    React.useEffect(() => {
        if (eRef && eRef.current) {
            const node = eRef.current;
            // if (props.lang === 'python') {
                // node.editor.commands.addCommand({
                //     // commands is array of key bindings.
                //     name: 'execute',
                //     bindKey: { win: 'Ctrl-Enter', mac: 'Command-Enter' },
                //     exec: () => execScript((window as any).__BRYTHON__),
                // });
            // }
            // node.editor.commands.addCommand({
            //     // commands is array of key bindings.
            //     name: 'save',
            //     bindKey: { win: 'Ctrl-s', mac: 'Command-s' },
            //     exec: () => {
            //         pyScript.saveService.saveNow();
            //     },
            // });
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
    }, [eRef, script, script.lang]);

    return (
        <div className={clsx(styles.brythonCodeBlock, styles.editor)}>
            <AceEditor
                className={clsx(styles.brythonEditor, !props.showLineNumbers && styles.noGutter)}
                style={{
                    width: '100%',
                }}
                onPaste={(e) => {
                    if (props.versioned) {
                        /**
                         * Save and mark pasted content immediately
                         */
                        // pyScript.setPastedEdit(true);
                        // pyScript.saveService.saveNow();
                    }
                }}
                focus={false}
                navigateToFileEnd={false}
                maxLines={props.maxLines || 25}
                ref={eRef}
                mode={ALIAS_LANG_MAP_ACE[script.lang as keyof typeof ALIAS_LANG_MAP_ACE] ?? script.lang}
                theme="dracula"
                onChange={(value: string) => {
                    script.setCode(value);
                }}
                readOnly={false}
                value={script.code}
                defaultValue={script.code || '\n'}
                name={DOM_ELEMENT_IDS.aceEditor(script.codeId)}
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
};
export default Editor;
