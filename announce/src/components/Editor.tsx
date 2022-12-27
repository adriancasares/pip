import React, { useEffect, useState } from "react";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";

export default function Editor(props: {
  setBody: (body: string) => void;
  label: string;
  preset: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      TextStyle,
      Color,
      Placeholder.configure({ placeholder: "Write a captivating email..." }),
    ],
  });

  useEffect(() => {
    editor?.on("update", () => {
      props.setBody(editor.getHTML());
    });
  }, [editor]);

  return (
    <div>
      <p className="text-base text-slate-600 font-medium">{props.label}</p>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Toolbar>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Color color="" />
            <RichTextEditor.Color color="#F03E3E" />
            <RichTextEditor.Color color="#7048E8" />
            <RichTextEditor.Color color="#1098AD" />
            <RichTextEditor.Color color="#37B24D" />
            <RichTextEditor.Color color="#F59F00" />
          </RichTextEditor.ControlsGroup>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Control
              title="Load Preset"
              className="border-none rounded-lg overflow-hidden"
              aria-label="Load Preset"
              onClick={() => {
                editor.commands.setContent(props.preset);
                props.setBody(editor.getHTML());
              }}
            >
              <p className="px-2 bg-blue-500 text-white">Load Preset</p>
            </RichTextEditor.Control>
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content
          onChange={(e) => {
            console.log(e);
          }}
        />
      </RichTextEditor>
    </div>
  );
}
