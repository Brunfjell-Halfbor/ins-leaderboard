export default function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}) {
  return (
    <button
      className={`btn btn-${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// USAGE
// <Button>Save</Button>

// <Button variant="secondary">
//   Cancel
// </Button>