/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PyAceEditor from '@theme/AceEditor';
import CodeBlock from '@theme-init/CodeBlock';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';


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
  if (!id) {
    return;
  }
  return id.replace(/[\.\-#]/g, '_').replace(/[\.:,"'\s]/g, '')
}

const withLiveEditor = (Component) => {
  const WrappedComponent = (props) => {
    if (props.live_py && ExecutionEnvironment.canUseDOM) {
      return (
        <PyAceEditor
          {...props}
          codeId={sanitizeId(props.title || uniqueId())}
          title={props.title || 'Python'}
        />
      );
    }

    return <Component {...props} />;
  };

  return WrappedComponent;
};

export default withLiveEditor(CodeBlock);
