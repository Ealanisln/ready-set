export const metadata = {
  title: 'Ready Set | Helpdesk',
  description: 'Ready Set administrative helpdesk system',
};

export default function HelpdeskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* This is a minimalist layout with no header/footer */}
      {children}
    </>
  );
} 