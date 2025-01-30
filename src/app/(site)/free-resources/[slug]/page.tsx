import { notFound } from "next/navigation";
import EmailMetricsMatter from "@/components/Resources/EmailMetricsMatter";

const resources = [
  {
    title: "Why Email Metrics Matter",
    slug: "email-metrics-matter", // Coincide con `url` en tu array
    component: EmailMetricsMatter,
  },
  // Puedes agregar más recursos aquí...
];

export default function ResourcePage({ params }: { params: { slug: string } }) {
  // Buscar el recurso basado en el slug de la URL
  const resource = resources.find((r) => r.slug === params.slug);

  // Si no se encuentra, mostrar una página 404
  if (!resource) return notFound();

  // Renderizar el componente correspondiente
  const ResourceComponent = resource.component;
  return <ResourceComponent />;
}
