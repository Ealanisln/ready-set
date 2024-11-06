"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Users, 
  CreditCard, 
  Database, 
  UserCog, 
  Circle,
  LayoutDashboard,
  ArrowRight,
  Code,
  Server,
  Github,
  Clock
} from 'lucide-react';

// Types
interface TechStackItem {
  [key: string]: string | string[];
}

interface TechStack {
  frontend: TechStackItem;
  backend: TechStackItem;
  devops: TechStackItem;
}

interface Node {
  id: string;
  label: string;
  tech?: string[];
  endpoints?: string[];
  models?: string[];
}

interface Section {
  title: string;
  icon: React.ElementType;
  color: string;
  nodes: Node[];
}

interface Sections {
  [key: string]: Section;
}

interface Flow {
  from: string;
  to: string;
  label: string;
}

interface Phase {
  title: string;
  duration: string;
  tasks: string[];
}

// Data
const techStack: TechStack = {
  frontend: {
    framework: 'Next.js 14 (App Router)',
    ui: ['shadcn/ui', 'Tailwind CSS', 'Lucide Icons'],
    state: ['React Context API', 'Zustand'],
    forms: ['React Hook Form', 'Zod'],
    api: ['TanStack Query', 'Axios']
  },
  backend: {
    runtime: 'Node.js',
    framework: 'Next.js API Routes',
    database: 'PostgreSQL',
    orm: 'Prisma',
    auth: 'NextAuth.js',
    storage: 'AWS S3',
    email: 'SendGrid/AWS SES',
    payments: 'Stripe'
  },
  devops: {
    hosting: 'Vercel',
    database: 'Vercel Postgres',
    cicd: 'GitHub Actions',
    monitoring: ['Vercel Analytics', 'Sentry'],
    testing: ['Jest', 'React Testing Library', 'Playwright']
  }
};

const sections: Sections = {
  client: {
    title: 'Client Side',
    icon: Users,
    color: 'bg-blue-500',
    nodes: [
      { 
        id: 'landing', 
        label: 'Landing Page',
        tech: ['Next.js Pages', 'Tailwind CSS', 'shadcn/ui'],
        endpoints: []
      },
      { 
        id: 'pricing', 
        label: 'Pricing Page',
        tech: ['Stripe Products API', 'TanStack Query'],
        endpoints: ['GET /api/subscriptions/packages']
      },
      { 
        id: 'checkout', 
        label: 'Checkout Flow',
        tech: ['Stripe Elements', 'React Hook Form'],
        endpoints: ['POST /api/subscriptions/create']
      },
      { 
        id: 'dashboard', 
        label: 'Client Dashboard',
        tech: ['Zustand', 'TanStack Query', 'shadcn/ui'],
        endpoints: ['GET /api/va/tasks', 'POST /api/va/tasks/create']
      }
    ]
  },
  payment: {
    title: 'Payment Processing',
    icon: CreditCard,
    color: 'bg-green-500',
    nodes: [
      { 
        id: 'stripe', 
        label: 'Stripe Integration',
        tech: ['Stripe API', 'Webhooks'],
        endpoints: ['POST /api/webhooks/stripe']
      },
      { 
        id: 'subscription', 
        label: 'Subscription Creation',
        tech: ['Prisma', 'PostgreSQL'],
        endpoints: ['POST /api/subscriptions/create', 'PUT /api/subscriptions/update']
      },
      { 
        id: 'invoice', 
        label: 'Invoice Generation',
        tech: ['Stripe Billing', 'SendGrid'],
        endpoints: ['GET /api/subscriptions/invoices']
      }
    ]
  },
  database: {
    title: 'Database Layer',
    icon: Database,
    color: 'bg-purple-500',
    nodes: [
      { 
        id: 'users', 
        label: 'User Management',
        tech: ['Prisma', 'NextAuth.js'],
        models: ['User', 'Profile']
      },
      { 
        id: 'subs', 
        label: 'Subscription Management',
        tech: ['Prisma', 'PostgreSQL'],
        models: ['Subscription', 'Package']
      },
      { 
        id: 'usage', 
        label: 'Usage Tracking',
        tech: ['Prisma', 'Analytics API'],
        models: ['UsageMetrics', 'TimeLog']
      }
    ]
  },
  va: {
    title: 'VA Management',
    icon: UserCog,
    color: 'bg-pink-500',
    nodes: [
      { 
        id: 'profiles', 
        label: 'VA Profiles',
        tech: ['Prisma', 'S3'],
        models: ['VAProfile', 'Specialty']
      },
      { 
        id: 'va-tasks', 
        label: 'Task Management',
        tech: ['Zustand', 'TanStack Query'],
        models: ['Task', 'Assignment']
      },
      { 
        id: 'time', 
        label: 'Time Tracking',
        tech: ['PostgreSQL', 'Analytics API'],
        models: ['TimeEntry', 'Report']
      }
    ]
  }
};

const flows: Flow[] = [
  { from: 'landing', to: 'pricing', label: 'Browse Plans' },
  { from: 'pricing', to: 'checkout', label: 'Select Package' },
  { from: 'checkout', to: 'stripe', label: 'Process Payment' },
  { from: 'stripe', to: 'subscription', label: 'Create Subscription' },
  { from: 'subscription', to: 'dashboard', label: 'Access Services' },
  { from: 'dashboard', to: 'va-tasks', label: 'Assign Tasks' }
];

const phases: Phase[] = [
  {
    title: 'Phase 1: Foundation',
    duration: '2-3 weeks',
    tasks: [
      'Project setup and configuration',
      'Authentication system',
      'Basic user management',
      'Database implementation'
    ]
  },
  {
    title: 'Phase 2: Subscription System',
    duration: '2-3 weeks',
    tasks: [
      'Stripe integration',
      'Package management',
      'Subscription flows',
      'Billing system'
    ]
  },
  {
    title: 'Phase 3: VA Management',
    duration: '3-4 weeks',
    tasks: [
      'VA profiles',
      'Availability management',
      'Assignment system',
      'Task management'
    ]
  },
  {
    title: 'Phase 4: Client Dashboard',
    duration: '2-3 weeks',
    tasks: [
      'Hours tracking',
      'Task management',
      'Communication system',
      'Reports and analytics'
    ]
  },
  {
    title: 'Phase 5: Admin Panel',
    duration: '2-3 weeks',
    tasks: [
      'User management',
      'Subscription management',
      'Analytics dashboard',
      'System settings'
    ]
  }
];

// Components
const TechStackCard = ({ category, stack }: { category: string; stack: TechStackItem }) => {
  const getIcon = () => {
    switch (category) {
      case 'frontend': return <Code className="w-5 h-5" />;
      case 'backend': return <Server className="w-5 h-5" />;
      case 'devops': return <Github className="w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getIcon()}
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Object.entries(stack).map(([key, value]) => (
            <div key={key}>
              <div className="font-medium">{key}</div>
              <div className="text-sm text-muted-foreground">
                {typeof value === 'string' ? value : value.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const NodeCard = ({ 
  node, 
  section, 
  flows,
  hoveredNode,
  onHover 
}: { 
  node: Node; 
  section: Section;
  flows: Flow[];
  hoveredNode: string | null;
  onHover: (id: string | null) => void;
}) => {
  const outgoingFlows = flows.filter(flow => flow.from === node.id);
  const incomingFlows = flows.filter(flow => flow.to === node.id);

  return (
    <Card
      className={`transition-all duration-200 ${
        hoveredNode === node.id ? 'ring-2 ring-primary' : ''
      }`}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Circle className={`w-3 h-3 ${section.color}`} />
            <span className="font-medium">{node.label}</span>
          </div>
        </div>

        {node.tech && (
          <div className="mb-3">
            <div className="text-sm font-medium mb-1">Technologies:</div>
            <div className="flex flex-wrap gap-1">
              {node.tech.map(tech => (
                <span key={tech} className="text-xs px-2 py-1 bg-muted rounded">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {node.endpoints && node.endpoints.length > 0 && (
          <div className="mb-3">
            <div className="text-sm font-medium mb-1">API Endpoints:</div>
            <div className="space-y-1">
              {node.endpoints.map(endpoint => (
                <div key={endpoint} className="text-xs text-muted-foreground">
                  {endpoint}
                </div>
              ))}
            </div>
          </div>
        )}

        {node.models && node.models.length > 0 && (
          <div className="mb-3">
            <div className="text-sm font-medium mb-1">Data Models:</div>
            <div className="flex flex-wrap gap-1">
              {node.models.map(model => (
                <span key={model} className="text-xs px-2 py-1 bg-muted rounded">
                  {model}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {(outgoingFlows.length > 0 || incomingFlows.length > 0) && (
          <div className="mt-4 space-y-2 pt-3 border-t">
            {outgoingFlows.length > 0 && (
              <div>
                <p className="text-sm font-medium">Outgoing:</p>
                <ul className="list-inside space-y-1">
                  {outgoingFlows.map(flow => (
                    <li key={flow.to} className="text-xs flex items-center gap-1">
                      <ArrowRight className="w-3 h-3" />
                      <span>{flow.to}</span>
                      <span className="text-muted-foreground">({flow.label})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {incomingFlows.length > 0 && (
              <div>
                <p className="text-sm font-medium">Incoming:</p>
                <ul className="list-inside space-y-1">
                  {incomingFlows.map(flow => (
                    <li key={flow.from} className="text-xs flex items-center gap-1">
                      <ArrowRight className="w-3 h-3 rotate-180" />
                      <span>{flow.from}</span>
                      <span className="text-muted-foreground">({flow.label})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const PhaseCard = ({ phase }: { phase: Phase }) => (
  <Card className="rounded-lg">
    <CardContent className="p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-primary">{phase.title}</h3>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{phase.duration}</span>
        </div>
      </div>
      <ul className="list-inside space-y-2">
        {phase.tasks.map((task, index) => (
          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
            <span className="text-primary mt-1.5">•</span>
            <span>{task}</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

// Main Component
const SystemArchitectureViewer = () => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <div className="container mx-auto p-6">
      <Accordion type="multiple" className="w-full space-y-4">
        {/* Tech Stack Section */}
        <AccordionItem value="tech-stack">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Technology Stack</h2>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-6 md:grid-cols-3 pt-4">
              {Object.entries(techStack).map(([category, stack]) => (
                <TechStackCard key={category} category={category} stack={stack} />
              ))}
            </div>
          </AccordionContent>

          </AccordionItem>


{/* System Sections */}
<AccordionItem value="system-sections">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              <h2 className="text-xl font-semibold">System Components</h2>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-8 pt-4">
              {Object.entries(sections).map(([key, section]) => (
                <div key={key} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${section.color}`} />
                    <h3 className="text-lg font-semibold">{section.title}</h3>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {section.nodes.map((node) => (
                      <NodeCard 
                        key={node.id} 
                        node={node} 
                        section={section}
                        flows={flows}
                        hoveredNode={hoveredNode}
                        onHover={setHoveredNode}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Implementation Timeline */}
        <AccordionItem value="timeline">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Implementation Timeline</h2>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-4">
              {phases.map((phase, index) => (
                <PhaseCard key={index} phase={phase} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Data Flow */}
        <AccordionItem value="data-flow">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <ArrowRight className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Data Flow</h2>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4">System Interactions</h3>
                  <div className="space-y-3">
                    {flows.map((flow, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <span className="font-medium text-primary">{flow.from}</span>
                        <ArrowRight className="w-4 h-4" />
                        <span className="font-medium text-primary">{flow.to}</span>
                        <span className="text-xs">({flow.label})</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default SystemArchitectureViewer;

        