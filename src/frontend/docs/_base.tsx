import { OffCanvas } from "frontend/design-system/components/OffCanvas";
import { ReactNode } from "react";
import styled from "styled-components";
import { useDocumentationCanvasStore } from "./constants";

const Root = styled.div`
  margin-top: -8px;

  h4,
  h5 {
    margin-bottom: -8px !important;
  }

  h5 {
    font-size: 15px;
  }

  p {
    margin: 12px 0;
    font-size: 16px !important;
  }

  code {
    font-style: italic;
  }

  pre {
    min-height: initial;
  }

  ul,
  ol {
    margin-top: 0px;
    padding-left: 24px;
  }
`;

export function DocumentationRoot({ children }: { children: ReactNode }) {
  const canvasStore = useDocumentationCanvasStore();
  return (
    <OffCanvas
      title={canvasStore.title}
      onClose={() => canvasStore.setTitle("")}
      show={!!canvasStore.title}
      width={600}
    >
      <Root>{children}</Root>
    </OffCanvas>
  );
}
