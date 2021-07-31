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
  try {
    if (!window.__LIVE_BRYTHON__) {
      window.__LIVE_BRYTHON__ = {};
    }
    if (!window.__LIVE_BRYTHON__.code_counter) {
      window.__LIVE_BRYTHON__.code_counter = 0;
    }
    window.__LIVE_BRYTHON__.code_counter = window.__LIVE_BRYTHON__.code_counter + 1;
    return `py_${window.__LIVE_BRYTHON__.code_counter}`;
  } catch (e) {
    return `py_${Math.floor(Math.random() * 999999)}`
  }
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
