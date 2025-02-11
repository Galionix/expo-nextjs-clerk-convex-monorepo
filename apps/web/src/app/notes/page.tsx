import Header from "@/components/Header";
import Notes from "@/components/notes/Notes";
import { utilityColors, light } from '@packages/ui';

export default function Home() {
  return (
    <main className="bg-[#EDEDED] h-screen">
      {/* <pre>{JSON.stringify(utilityColors, null, 2)}</pre>
      <pre>{JSON.stringify(light, null, 2)}</pre> */}
      <Header />
      <Notes />
    </main>
  );
}
