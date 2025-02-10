export const generateSlug = (title: string) => {
  console.log('Generating slug for title:', title);
  const slug = title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
  console.log('Generated slug:', slug);
  return slug;
};