import { parse, RootNode } from 'svg-parser';

const objToAttr = (obj) => {
    return Object.entries(obj || {}).map((v) => `${v[0]}="${v[1]}"`).join(' ')
}

/**
 * 
 * @param {RootNode} parsedSvg 
 * @param {object} svgProps 
 */
const mergeSvgProps = (parsedSvg, svgProps) => {
    if (parsedSvg.type === 'root') {
        parsedSvg.children.forEach(child => {
            mergeSvgProps(child, svgProps)
        })
    } else if (parsedSvg.type === 'element' && parsedSvg.tagName === 'svg' && 'properties' in parsedSvg) {
        parsedSvg.properties = {...parsedSvg.properties, ...svgProps};
    }
}

/**
 * 
 * @param {RootNode} element 
 * @returns {string[]}
 */
const svgWithoutAnimations = (element) => {
    const newSvg = []
    const { properties, tagName, type, children } = element;
    if (type === 'root') {
        children.forEach(child => {
            newSvg.push(...svgWithoutAnimations(child))
        })
    }
    switch (tagName) {
        case 'svg':
            if (element.metadata) {
                newSvg.push(element.metadata);
            }
            newSvg.push(`<svg ${objToAttr(properties)}>`)
            children.forEach(child => {
                newSvg.push(...svgWithoutAnimations(child))
            })
            newSvg.push(`</svg>`)
            break;    
        case 'g':
            if ((children || []).length === 0) {
                return newSvg;
            }
            newSvg.push(`<g ${objToAttr(properties)}>`)
            children.forEach(child => {
                newSvg.push(...svgWithoutAnimations(child))
            })
            newSvg.push('</g>')
            break;
        case 'line':
            children.forEach(child => {
                if (child.tagName === 'animate' && !!child.properties) {
                    const animProps = child.properties;
                    if (!('from' in animProps) || !('to' in animProps) || !('attributeName' in animProps)) {
                        return;
                    }
                    if (animProps.attributeName in properties) {
                        properties[animProps.attributeName] = animProps.to
                    }
                }
            })
            newSvg.push(`<line ${objToAttr(properties)}></line>`)
            break;
        case 'circle':
            children.forEach(child => {
                if (child.tagName === 'animate' && !!child.properties) {
                    const animProps = child.properties;
                    if (!('from' in animProps) || !('to' in animProps) || !('attributeName' in animProps)) {
                        return;
                    }
                    if (child.attributeName === 'display' && child.attributeType === 'CSS') {
                        properties.style = properties.style.replace(/display:\s*\b\w+\b;/g, `display: ${animProps.to}`);
                    }
                }
            })
            if (properties.style && /\s*display:\s*none;\s*/.test(properties.style)) {
                properties.style = properties.style.replace(/\s*display:\s*none;\s*/g, '');
            }
            newSvg.push(`<circle ${objToAttr(properties)}></circle>`);
            break;
        case 'text':
            var text = ''
            children.forEach(child => {
                switch (child.type) {
                    case 'text':
                        text = child.value
                        break;
                    case 'element':
                        const textProps = child.properties;
                        if (child.tagName !== 'animate') {
                            return;
                        }
                        if (!('from' in textProps) || !('to' in textProps) || !('attributeName' in textProps)) {
                            return;
                        }
                        if (textProps.attributeName === 'display' && textProps.attributeType === 'CSS') {
                            properties.style = properties.style.replace(/display:\s*\b\w+\b;/g, `display: ${textProps.to};`);
                        }

                        if (textProps.attributeName in properties) {
                            properties[textProps.attributeName] = textProps.to
                        }
                        break;
                }
            })
            newSvg.push(`<text ${objToAttr(properties)}>${text}</text>`);
            break;
        case 'polygon':
            var endRot = '0,0,0';
            var endPos = '0,0';
            children.forEach(child => {
                const polyProps = child.properties;
                switch (child.tagName) {
                    case 'animate':
                        if (!('from' in polyProps) || !('to' in polyProps) || !('attributeName' in polyProps)) {
                            return;
                        }
                        if (polyProps.attributeName === 'display' && polyProps.attributeType === 'CSS') {
                            properties.style = properties.style.replace(/display:\s*\b\w+\b;/g, `display: ${polyProps.to};`);
                        }

                        if (polyProps.attributeName in properties) {
                            properties[polyProps.attributeName] = polyProps.to
                        }
                        break;
                    case 'animateTransform':
                        if (child.properties.type === 'rotate') {
                            endRot = child.properties.to;
                        }
                        break;
                    case 'animateMotion':
                        if ('to' in child.properties) {
                            endPos = child.properties.to;
                        }
                        break;
                }
            })
            newSvg.push(`<polygon ${objToAttr(properties)} transform="translate(${endPos}) rotate(${endRot})"></polygon>`)

    }
    return newSvg;
}

/**
 * 
 * @param {string} svg 
 * @param {string} newId
 * @return {string}
 */
const removeAnimations = (svg, svgProps) => {
    const parsed = parse(svg);
    if (svgProps) {
        mergeSvgProps(parsed, svgProps);
    }
    const elements = svgWithoutAnimations(parsed);
    return elements.join('\n')
}

export {removeAnimations}