export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      {children} {/* No Header & Footer here */}
    </main>
  );
}
