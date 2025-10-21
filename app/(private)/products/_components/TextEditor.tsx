"use client";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export const TextEditor = ({
  value,
  onChange,
  label,
}: {
  value: string | undefined;
  label?: string;
  onChange: (value: string) => void;
}) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5,false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "code-block"],
      ["clean"],
    ],
    history: {
      delay: 500,
      maxStack: 100,
      userOnly: true,
    },
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "align",
    "strike",
    "script",
    "blockquote",
    "background",
    "list",
    "indent",
    "link",
    "color",
    "code-block",
  ];

  return (
    <div>
      {label && <h1 className="mb-2 text-sm font-medium">{label}</h1>}
      <div className="text-editor">
        {/* <EditorToolbar /> */}
        <ReactQuill
          theme="snow"
          value={value} // Controlled component
          onChange={onChange} // Passes only the value to the onChange handler
          placeholder={"Write something..."}
          modules={modules}
          formats={formats}
          className="dark:bg-dark dark:text-white"
        />
      </div>
    </div>
  );
};
