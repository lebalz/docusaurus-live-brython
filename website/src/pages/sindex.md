# Brython + Docusaurus = ❤️

Welcome to Live Python in Docusaurus.

With this Theme-Plugin for Docusaurus 3+ you can run Python code snippets in your documentation and can even change the code on the fly. It is the Python-equivalent to Docusaurus' well known [👉 Live Codeblock](https://docusaurus.io/docs/api/themes/@docusaurus/theme-live-codeblock) for JSX.

This theme plugin relys on the awesome [👉 Brython](https://brython.info/index.html)-library written and maintained by [@Pierre Quentel](https://github.com/PierreQuentel), which is a Python 3 implementation for client-side web programming. Brython **transpiles** the written code to Javascript, so it can be executed directly within the browser 🥳.

<details>
<summary>
Known Brython Limitations
</summary>
Of course the transpilation to JS brings some limitations with it:

- No `time.sleep()`
- No "Non-plain" Python Libraries.

Brython is executed in the browser, so it is limited by the browser's capabilities. But still almost anything is possible in Brython as long as you have **pure Python** code - this also applies to libraries. This means too that popular libraries such as *Numpy* or *Pandas* (which rely on `C`-Code) cannot be used.


For more details, see [👉 Brython's documentation](https://brython.info/static_doc/3.12/en/intro.html).
</details>

<a href="/docs" className="button button--primary">Get Started</a>

