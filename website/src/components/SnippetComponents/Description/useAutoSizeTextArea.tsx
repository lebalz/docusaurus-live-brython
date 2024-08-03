import { useEffect } from 'react';

const MIN_PX = 16;
// Updates the height of a <textarea> when the value changes.
const useAutosizeTextArea = (
    textAreaRef: HTMLTextAreaElement | null,
    value: string,
    rows?: number,
    deps?: React.DependencyList
) => {
    useEffect(() => {
        if (textAreaRef) {
            // We need to reset the height momentarily to get the correct scrollHeight for the textarea
            textAreaRef.style.height = 'auto';
            const scrollHeight = textAreaRef.scrollHeight;
            const minPx = (rows ?? 1) * MIN_PX;

            // We then set the height directly, outside of the render loop
            // Trying to set this with state or a ref will produce an incorrect value.
            textAreaRef.style.height = `${scrollHeight < minPx ? minPx : scrollHeight}px`;
        }
    }, [textAreaRef, value, ...[deps ?? []]]);
};

export default useAutosizeTextArea;
