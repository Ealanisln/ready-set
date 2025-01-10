'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface MermaidDiagramProps {
  chart: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && containerRef.current) {
      import('mermaid').then((mermaid) => {
        mermaid.default.initialize({
          startOnLoad: true,
          theme: 'default',
          securityLevel: 'loose',
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis',
            rankSpacing: 100,
            nodeSpacing: 70
          },
          fontSize: 18
        });

        mermaid.default.render('mermaid-diagram', chart).then(({ svg }) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
          }
        });
      });
    }
  }, [chart, isClient]);

  return (
    <div className="flex justify-center w-full">
      <div ref={containerRef} className="w-full min-w-[800px] max-w-[1200px] overflow-x-auto" />
    </div>
  );
};

const WorkflowDocumentation = () => {
  const { workflowDiagram } = {
    workflowDiagram: {
      title: "Job Application and Approval Workflow",
      chart: `flowchart TD
        Start((Start)) --> A[Candidate Fills Application Form]
        A -->|Submits| B[System Records Application]
        B -->|Automatic| C[Email Notification to Admin]
        B -->|Status: Pending| D[Application Stored in Database]
        
        D --> E[Admin Reviews Application]
        E -->|Approve| F[Create User Account]
        E -->|Reject| G[Update Status to Rejected]
        G -->|Automatic| H[Send Rejection Email]
        
        F -->|Automatic| I[Generate Temporary Password]
        I -->|Automatic| J[Send Welcome Email]
        J --> K[New Employee Account Active]
        
        K -->|First Login| L[Force Password Change]
        L -->|Complete| M[Full Platform Access]
        
        subgraph Database
        D
        end
        
        subgraph Admin Panel
        E
        end
        
        subgraph Employee Onboarding
        K
        L
        M
        end
        
        style Start fill:#4CAF50,stroke:#333,stroke-width:2px
        style F fill:#2196F3,stroke:#333,stroke-width:2px
        style G fill:#f44336,stroke:#333,stroke-width:2px
        style M fill:#4CAF50,stroke:#333,stroke-width:2px
        
        classDef email fill:#FFF9C4,stroke:#333,stroke-width:1px
        class C,H,J email
        
        classDef process fill:#E3F2FD,stroke:#333,stroke-width:1px
        class A,B,D,E,I,K,L process`
    }
  };

  return (
    <div className="space-y-8">
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">{workflowDiagram.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <MermaidDiagram chart={workflowDiagram.chart} />
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkflowDocumentation;