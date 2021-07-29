/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PyAceEditor from '@theme/AceEditor';
import CodeBlock from '@theme-init/CodeBlock';
import BrowserOnly from '@docusaurus/BrowserOnly';


function uniqueId() {
  const id = [...Array(8)].map((v) => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
  return `py_${id}`
}

/**
 * 
 * @param {string} id 
 * @returns string
 */
function sanitizeId(id) {
  return id.replaceAll('.', '_')
    .replaceAll('-', '_')
    .replaceAll('#', '_')
    .replaceAll(':', '')
    .replaceAll(',', '')
    .replaceAll('"', '')
    .replaceAll("'", '')
    .replaceAll(' ', '')
}

const withLiveEditor = (Component) => {
  const WrappedComponent = (props) => {
    if (props.live_py) {
      return (
        <BrowserOnly
          fallback={<Component {...props} />}
          children={() => {
            return (
              <PyAceEditor
                {...props}
                codeId={sanitizeId(props.title || uniqueId())}
                title={props.title || 'Python'}
              />
            );
          }}
        />
      );
    }

    return <Component {...props} />;
  };

  return WrappedComponent;
};

export default withLiveEditor(CodeBlock);
