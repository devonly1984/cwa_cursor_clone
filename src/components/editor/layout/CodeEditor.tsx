import { useEffect, useMemo, useRef } from "react";

import {EditorView,keymap} from '@codemirror/view'
import { customTheme } from "../extensions/Theme";
import { oneDark } from "@codemirror/theme-one-dark";
import { getLanguageExtension } from "../extensions/LanguageExtenstion";
import {indentWithTab} from '@codemirror/commands'
import { minimap } from "../extensions/MiniMap";
import {indentationMarkers} from '@replit/codemirror-indentation-markers'
import { customSetup } from "../extensions/CustomSetup";
interface Props {
  fileName: string;
  initialValue?:string;
  onChange:(value:string)=>void;
}
const CodeEditor = ({ fileName, initialValue = "", onChange }: Props) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const languageExtension = useMemo(
    () => getLanguageExtension(fileName),
    [fileName],
  );
  useEffect(() => {
    if (!editorRef.current) return;
    const view = new EditorView({
      doc: initialValue,
      parent: editorRef.current,
      extensions: [
        customSetup,
        languageExtension,
        oneDark,
        customTheme,
        keymap.of([indentWithTab]),
        minimap(),
        indentationMarkers(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        }),
      ],
    });
    viewRef.current = view;
    return () => {
      view.destroy();
    };
  }, []);
  return <div ref={editorRef} className="size-full pl-4 bg-background" />;
};
export default CodeEditor;
