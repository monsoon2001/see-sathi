import type { NoteBlock, NoteBlockType } from "@/lib/types";
import {
  DefinitionBlock,
  ExampleBlock,
  FormulaBlock,
  HeadingBlock,
  ImageWithCaption,
  ParagraphBlock,
  TipCallout,
} from "./contentBlocks";

export function NotesRenderer({ blocks }: { blocks: NoteBlock[] }) {
  let headingIndex = -1;

  return (
    <div className="space-y-8">
      {blocks.map((block, i) => {
        switch (block.type as NoteBlockType) {
          case "heading":
            headingIndex += 1;
            return <HeadingBlock key={i} block={block} index={headingIndex} id={`section-${headingIndex}`} />;
          case "paragraph":
            return <ParagraphBlock key={i} block={block} />;
          case "definition":
            return <DefinitionBlock key={i} block={block} />;
          case "formula":
            return <FormulaBlock key={i} block={block} />;
          case "example":
            return <ExampleBlock key={i} block={block} />;
          case "image":
            return <ImageWithCaption key={i} block={block} />;
          case "tip":
            return <TipCallout key={i} block={block} variant="tip" />;
          case "warning":
            return <TipCallout key={i} block={block} variant="warning" />;
          default:
            return null;
        }
      })}
    </div>
  );
}