// /pages/index.tsx (or /pages/page.tsx depending on your setup)
import Demo from "./components/demo";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col p-4">
      <Demo />  {/* Render the Demo component */}
    </main>
  );
}
