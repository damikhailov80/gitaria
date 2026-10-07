import { Header } from "@/components/Header";
import { Tuner } from "./Tuner";

export const metadata = { title: "Тюнер для гитары и укулеле — Gitaria" };

export default function TunerPage() {
  return (
    <>
      <Header action="login" />
      <main className="container">
        <Tuner />
      </main>
    </>
  );
}
