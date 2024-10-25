const SectionTitle = ({
  title,
  subtitle,
  paragraph,
  width = "635px",
  center,
}: {
  title: string;
  subtitle?: string;
  paragraph: string;
  width?: string;
  center?: boolean;
}) => {
  return (
    <div className="-mx-4 flex flex-wrap">
      <div
        className={`wow fadeInUp w-full px-4 ${
          center ? "mx-auto text-center" : ""
        }`}
        data-wow-delay=".1s"
        style={{ maxWidth: width }}
      >
        <h1 className="mb-4 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]">
          {title}
        </h1>
        {subtitle && (
          <h2 className="mb-2 block text-lg font-semibold text-primary">
            {subtitle}
          </h2>
        )}
        
        <p className="text-base leading-relaxed text-body-color dark:text-dark-6 sm:leading-relaxed">
          {paragraph}
        </p>
      </div>
    </div>
  );
};

export default SectionTitle;
