import React, { useEffect, useState } from "react";
import { RichTextEditor, Link } from "@mantine/tiptap";
import { BubbleMenu, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";
import { motion } from "framer-motion";
export default function Editor(props: {
  initialBody: string;
  setBody: (body: string) => void;
  blueBackground?: boolean;
  height?: number;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: "Write stuff here.",
      }),
    ],
    content: props.initialBody,
  });

  useEffect(() => {
    editor?.on("update", () => {
      props.setBody(editor.getHTML());
    });
  }, [editor]);

  useEffect(() => {
    if (
      props.initialBody.replace(/\s/g, "") !==
      editor?.getHTML().replace(/\s/g, "")
    ) {
      editor?.commands.setContent(props.initialBody);
    }
  }, [props.initialBody]);

  const [focused, setFocused] = useState(false);
  return (
    <div>
      <RichTextEditor
        editor={editor}
        className={`border-0 p-0`}
        onFocus={() => {
          setFocused(true);
        }}
        onBlur={() => {
          setFocused(false);
        }}
        styles={{
          content: {
            height: props.height,
            backgroundColor: focused
              ? props.blueBackground
                ? "rgba(238, 242, 255, .5)"
                : "#F8F8F8"
              : "transparent",
          },
        }}
      >
        {editor && (
          <BubbleMenu editor={editor}>
            <RichTextEditor.ControlsGroup className="bg-white">
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
              <RichTextEditor.ColorPicker
                colors={["#F03E3E", "#7048E8", "#1098AD", "#37B24D", "#F59F00"]}
              />
              <RichTextEditor.UnsetColor />
              <RichTextEditor.ClearFormatting />
            </RichTextEditor.ControlsGroup>
          </BubbleMenu>
        )}

        <RichTextEditor.Content
          className="font-sans"
          onChange={() => {
            props.setBody(editor?.getHTML() ?? "");
          }}
        />
      </RichTextEditor>
    </div>
  );
}
