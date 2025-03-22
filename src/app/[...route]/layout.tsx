import AddButton from "../_components/addbutton";

export default function RouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="relative h-full">
      {children}
      <div className="fixed bottom-4 right-4 z-10">
        <AddButton />
      </div>
    </section>
  );
}
