import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

const WysiwygEditor = forwardRef(function WysiwygEditor(
  { value, onChange, plugins = [], placeholder = 'Start writing...', className = '', style = {} },
  ref
) {
  const containerRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    let editor;

    import('@wysiwyg/editor-core').then(({ Editor: EditorCore }) => {
      editor = new EditorCore({
        element: containerRef.current,
        plugins,
        placeholder,
      });

      editorRef.current = editor;

      if (value) {
        editor.setHTML(value);
      }

      editor.on('change', ({ html }) => {
        if (onChange) onChange(html);
      });
    });

    return () => {
      if (editor) editor.destroy();
    };
    // plugins and placeholder are read once at mount time (like TinyMCE's init config).
    // Changing them after mount does not recreate the editor; use editor.exec() or
    // the imperative ref handle instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (editorRef.current && value !== undefined) {
      const current = editorRef.current.getHTML();
      if (current !== value) {
        editorRef.current.setHTML(value);
      }
    }
  }, [value]);

  useImperativeHandle(ref, () => ({
    getHTML: () => editorRef.current?.getHTML(),
    getJSON: () => editorRef.current?.getJSON(),
    exec: (cmd, opts) => editorRef.current?.exec(cmd, opts),
    undo: () => editorRef.current?.undo(),
    redo: () => editorRef.current?.redo(),
  }));

  return <div ref={containerRef} className={className} style={style} />;
});

export default WysiwygEditor;
