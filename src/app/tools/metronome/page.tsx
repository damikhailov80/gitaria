import { Header } from "@/components/Header";
import { MetronomeTool } from "./MetronomeTool";

export const metadata = { title: "Метроном онлайн — Gitaria" };

export default function MetronomePage() {
  return (
    <>
      <Header action="login" />
      <main className="container">
        <MetronomeTool />
      </main>
    </>
  );
}
