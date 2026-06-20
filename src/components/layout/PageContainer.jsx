export default function PageContainer({title, subtitle, children,}) {
  return (
    <div className="max-w-7xl mx-auto">

      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          {title}
        </h1>

        {subtitle && (
          <p className="opacity-70 mt-2">
            {subtitle}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}