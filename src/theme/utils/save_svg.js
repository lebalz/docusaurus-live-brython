import { removeAnimations } from "./svg_without_animations";
import { getItem } from "./storage";
const saveSvg = (svgEl, name, codeId, contextId) => {
    svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    
    const bbox = svgEl.getBBox();
    const svgProps = {
      viewBox: `${bbox.x - 5},${bbox.y - 5},${bbox.width + 10},${bbox.height + 10}`,
      width: bbox.width + 10,
      height: bbox.height + 10
    }
    var svgData = svgEl.outerHTML;
    var preface = '<?xml version="1.0" standalone="no"?>';
    const svgWithoutAnim = removeAnimations(`${preface}${svgData}`, svgProps)
    const wrapper = document.createElement('div');

    // if no metadata should be added, set window.__DISABLE_TURTLE_METADATA__ = true
    if (window.__KEEP_TURTLE_ANIMATIONS__) {
      wrapper.innerHTML = `${preface}\r\n${svgEl.outerHTML}`;
    } else {
      wrapper.innerHTML = svgWithoutAnim;
    }
    // if no metadata should be added, set window.__DISABLE_TURTLE_METADATA__ = true
    if (!window.__DISABLE_TURTLE_METADATA__) {
      const svg = wrapper.querySelector('svg');
      const metadata = document.createElement('metadata');
      const script = document.createElement('raw');
      script.innerHTML = getItem(codeId, contextId, {}).executed || ''
      metadata.appendChild(script);
      svg.appendChild(metadata)
    }

    var svgBlob = new Blob([wrapper.innerHTML], { type: "image/svg+xml;charset=utf-8" });
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  export {saveSvg};