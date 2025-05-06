import TopNav from "~/app/_components/topnav";
import AddButton from "../../_components/addbutton";

export default async function RouteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ route: string[] }>;
}) {
  const { route } = await params;
  return (
    <section className="relative h-full">
      <TopNav />
      {children}
      <div className="fixed bottom-4 right-4 z-10">
        <AddButton ourRoutes={route} />
      </div>
    </section>
  );
}
