import { parse, RootNode } from "svg-parser";

const objToAttr = (obj: Object) => {
  return Object.entries(obj || {})
    .map((v) => `${v[0]}="${v[1]}"`)
    .join(" ");
};

const mergeSvgProps = (parsedSvg: RootNode, svgProps: Object) => {
  if (parsedSvg.type === "root") {
    parsedSvg.children.forEach((child) => {
      mergeSvgProps(child, svgProps);
    });
  } else if (
    parsedSvg.type === "element" &&
    parsedSvg.tagName === "svg" &&
    "properties" in parsedSvg
  ) {
    parsedSvg.properties = { ...parsedSvg.properties, ...svgProps };
  }
};

const svgWithoutAnimations = (element: RootNode): string[] => {
  const newSvg = [];
  const { properties, tagName, type, children } = element;
  if (type === "root") {
    children.forEach((child) => {
      newSvg.push(...svgWithoutAnimations(child));
    });
  }
  switch (tagName) {
    case "svg":
      if (element.metadata) {
        newSvg.push(element.metadata);
      }
      newSvg.push(`<svg ${objToAttr(properties)}>`);
      children.forEach((child) => {
        newSvg.push(...svgWithoutAnimations(child));
      });
      newSvg.push(`</svg>`);
      break;
    case "rect":
      children.forEach((child) => {
        if (["animate", "set"].includes(child.tagName) && !!child.properties) {
          const animProps = child.properties;
          if (!("to" in animProps) || !("attributeName" in animProps)) {
            return;
          }
          if (
            animProps.attributeName === "display" &&
            animProps.attributeType === "CSS"
          ) {
            properties.style = properties.style.replace(
              /display:\s*\b\w+\b;/g,
              `display: ${animProps.to};`
            );
          }
          properties[animProps.attributeName] = animProps.to;
        }
      });
      newSvg.push(`<rect ${objToAttr(properties)}></rect>`);
      break;
    case "g":
      if ((children || []).length === 0) {
        return newSvg;
      }
      newSvg.push(`<g ${objToAttr(properties)}>`);
      children.forEach((child) => {
        newSvg.push(...svgWithoutAnimations(child));
      });
      newSvg.push("</g>");
      break;
    case "line":
      children.forEach((child) => {
        if (["animate", "set"].includes(child.tagName) && !!child.properties) {
          const animProps = child.properties;
          if (!("to" in animProps) || !("attributeName" in animProps)) {
            return;
          }
          properties[animProps.attributeName] = animProps.to;
        }
      });
      newSvg.push(`<line ${objToAttr(properties)}></line>`);
      break;
    case "circle":
      children.forEach((child) => {
        if (["animate", "set"].includes(child.tagName) && !!child.properties) {
          const animProps = child.properties;
          if (!("to" in animProps) || !("attributeName" in animProps)) {
            return;
          }
          if (
            child.attributeName === "display" &&
            child.attributeType === "CSS"
          ) {
            properties.style = properties.style.replace(
              /display:\s*\b\w+\b;/g,
              `display: ${animProps.to}`
            );
          }
        }
      });
      if (properties.style && /\s*display:\s*none;\s*/.test(properties.style)) {
        properties.style = properties.style.replace(
          /\s*display:\s*none;\s*/g,
          ""
        );
      }
      newSvg.push(`<circle ${objToAttr(properties)}></circle>`);
      break;
    case "text":
      var text = "";
      children.forEach((child) => {
        switch (child.type) {
          case "text":
            text = child.value;
            break;
          case "element":
            const textProps = child.properties;
            if (!["animate", "set"].includes(child.tagName)) {
              return;
            }
            if (!("to" in textProps) || !("attributeName" in textProps)) {
              return;
            }
            if (
              textProps.attributeName === "display" &&
              textProps.attributeType === "CSS"
            ) {
              properties.style = properties.style.replace(
                /display:\s*\b\w+\b;/g,
                `display: ${textProps.to};`
              );
            }

            properties[textProps.attributeName] = textProps.to;
            break;
        }
      });
      newSvg.push(`<text ${objToAttr(properties)}>${text}</text>`);
      break;
    case "polygon":
      var endRot = "0,0,0";
      var endPos = "0,0";
      children.forEach((child) => {
        const polyProps = child.properties;
        switch (child.tagName) {
          case "set":
          case "animate":
            if (!("to" in polyProps) || !("attributeName" in polyProps)) {
              return;
            }
            if (
              polyProps.attributeName === "display" &&
              polyProps.attributeType === "CSS"
            ) {
              properties.style = properties.style.replace(
                /display:\s*\b\w+\b;/g,
                `display: ${polyProps.to};`
              );
            }

            properties[polyProps.attributeName] = polyProps.to;
            break;
          case "animateTransform":
            if (child.properties.type === "rotate") {
              endRot = child.properties.to;
            }
            break;
          case "animateMotion":
            if ("to" in child.properties) {
              endPos = child.properties.to;
            }
            break;
        }
      });
      newSvg.push(
        `<polygon ${objToAttr(
          properties
        )} transform="translate(${endPos}) rotate(${endRot})"></polygon>`
      );
  }
  return newSvg;
};

const removeAnimations = (svg: string, svgProps: Object): string => {
  const parsed = parse(svg);
  if (svgProps) {
    mergeSvgProps(parsed, svgProps);
  }
  const elements = svgWithoutAnimations(parsed);
  return elements.join("\n");
};

export { removeAnimations };
