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
import hashCode from '../utils/hash_code';
import { sanitizedTitle, sanitizeId } from '../utils/sanitizers';



function pageId() {
  try {
    const pageId = sanitizeId(window.location.pathname.replace(/^\/|\/$/g, ''))
    return pageId
  } catch (e) {
    return `py`
  }
}

const CONSOLE_ENUMERATION_MAPPING = {}

const getCodeId = (title, children) => {
  const page = pageId();
  if (!CONSOLE_ENUMERATION_MAPPING[page]) {
    CONSOLE_ENUMERATION_MAPPING[page] = {}
  }

  const codeHash = hashCode(children)
  if (!CONSOLE_ENUMERATION_MAPPING[page][codeHash]) {
    CONSOLE_ENUMERATION_MAPPING[page][codeHash] = Object.keys(CONSOLE_ENUMERATION_MAPPING[page]).length + 1;
  }
  const codeId = title ? sanitizeId(title) : `${CONSOLE_ENUMERATION_MAPPING[page][codeHash]}`;
  return codeId;
}

const withLiveEditor = (Component) => {
  const WrappedComponent = (props) => {
    if (props.live_py && ExecutionEnvironment.canUseDOM) {
      const contextId = pageId();
      const codeId = getCodeId(props.title, props.children.replace(/\n$/, ''));
      return (
        <PyAceEditor
          {...props}
          codeId={codeId}
          contextId={contextId}
          resettable={!props.persist}
          slim={!!props.slim}
          title={sanitizedTitle(props.title) || 'Python'}
        />
      );
    }

    return <Component {...props} />;
  };

  return WrappedComponent;
};

export default withLiveEditor(CodeBlock);
