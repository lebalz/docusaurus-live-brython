---
draft: true
---

import BrowserWindow from '@site/src/components/BrowserWindow';

<BrowserWindow url="https://lebalz.github.io/docusaurus-live-brython/">

# Markdown Live Code Blocks

Write your markdown code blocks and add `live_py` to the language to make it interactive.

```py live_py
print('Hello Brython from Docusaurus!')
```

<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1em', marginTop: '2em', marginBottom: '2em'}}>
    <img src="https://docusaurus.io/img/docusaurus_keytar.svg" width="80" height="80"/>
    <img src={require('./images/plus.png').default} width="50" height="50"/>
    <img src="/img/logo.png" width="80" height="80"/>
    <img src={require('./images/equals.png').default} width="50" height="50"/>
    <img src={require('./images/love.png').default} width="80" height="80"/>
</div>

</BrowserWindow>