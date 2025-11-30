import React, { memo, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import "katex/dist/katex.min.css";

const MarkdownRenderer = memo(({ content }: { content: string }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = async (text: string, codeId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(codeId);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={
        {
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeId = `code-${Math.random().toString(36).substr(2, 9)}`;
            const codeString = String(children).replace(/\n$/, "");

            return !inline && match ? (
              <div className="relative group">
                <button
                  onClick={() => copyToClipboard(codeString, codeId)}
                  className="absolute top-2 right-2 p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Copy code"
                >
                  {copiedCode === codeId ? <span>copied</span> : <span>copy</span>}
                </button>
                <SyntaxHighlighter style={dracula} language={match[1]} PreTag="div">
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code
                className={`${className} bg-zinc-800 dark:bg-zinc-800 px-1 py-0.5 rounded text-zinc-200`}
                {...props}
              >
                {children}
              </code>
            );
          },
          a: ({ ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 hover:underline"
            />
          ),
          p: ({ ...props }) => <p className="mb-2 last:mb-0" {...props} />,
          h1: ({ ...props }) => <h1 className="text-2xl font-bold mb-2 mt-4 first:mt-0" {...props} />,
          h2: ({ ...props }) => <h2 className="text-xl font-bold mb-2 mt-4 first:mt-0" {...props} />,
          h3: ({ ...props }) => <h3 className="text-lg font-bold mb-2 mt-3 first:mt-0" {...props} />,
          ul: ({ ...props }) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
          ol: ({ ...props }) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
          li: ({ ...props }) => <li className="ml-4" {...props} />,
          blockquote: ({ ...props }) => (
            <blockquote className="border-l-4 border-zinc-500 pl-4 italic my-2" {...props} />
          ),
        } satisfies Components
      }
    >
      {content}
    </ReactMarkdown>
  );
});

MarkdownRenderer.displayName = "MarkdownRenderer";

export default MarkdownRenderer;
