import { Suspense } from "react";
import { getSessionUser } from "@/lib/session";
import { HeaderBar } from "./HeaderBar";

/** Шапка сайта — одна на всех страницах: гостю «Войти», вошедшему — аватар. */
export function Header() {
  return (
    <Suspense fallback={<HeaderBar />}>
      <HeaderWithUser />
    </Suspense>
  );
}

async function HeaderWithUser() {
  const user = await getSessionUser();
  return <HeaderBar userName={user?.name ?? null} />;
}
