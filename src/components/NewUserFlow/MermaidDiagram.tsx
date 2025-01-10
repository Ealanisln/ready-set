// src/components/NewUserFlow/MermaidDiagram.tsx

interface MermaidDiagramProps {
  chart: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  return <div className="mermaid">{chart}</div>;
};

export default MermaidDiagram;
