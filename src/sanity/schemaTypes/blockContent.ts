import { defineType, defineArrayMember } from "sanity";

// Separate configuration objects for better organization
const blockStyles = [
  { title: "Normal", value: "normal" },
  { title: "H1", value: "h1" },
  { title: "H2", value: "h2" },
  { title: "H3", value: "h3" },
  { title: "H4", value: "h4" },
  { title: "Quote", value: "blockquote" },
];

const listTypes = [
  { title: "Bullet", value: "bullet" },
  { title: "Number", value: "number" },
];

const decoratorMarks = [
  { title: "Strong", value: "strong" },
  { title: "Emphasis", value: "em" },
  { title: "Code", value: "code" },
  { title: "Underline", value: "underline" },
];

export default defineType({
  title: "Block Content",
  name: "blockContent",
  type: "array",
  of: [
    defineArrayMember({
      title: "Block",
      type: "block",
      styles: blockStyles,
      lists: listTypes,
      marks: {
        decorators: decoratorMarks,
        annotations: [
          {
            title: "URL",
            name: "link",
            type: "object",
            fields: [
              {
                title: "URL",
                name: "href",
                type: "url",
                validation: (Rule) =>
                  Rule.uri({
                    scheme: ["http", "https", "mailto", "tel"],
                  }),
              },
              {
                title: "Open in new tab",
                name: "blank",
                type: "boolean",
                initialValue: true,
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "caption",
          type: "string",
          title: "Caption",
        },
      ],
    }),
  ],
});