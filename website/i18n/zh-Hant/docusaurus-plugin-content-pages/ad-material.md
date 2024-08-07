---
draft: true
---

import BrowserWindow from '@site/src/components/BrowserWindow';

<BrowserWindow url="https://lebalz.github.io/docusaurus-live-brython/">

# Markdown 實時代碼區塊

撰寫您的 Markdown 代碼區塊，並將 `live_py` 添加到語言中，使其互動。

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