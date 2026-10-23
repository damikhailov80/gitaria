import { Suspense } from "react";
import { getSessionUser } from "@/lib/session";
import { HeaderBar } from "./HeaderBar";

/** Site header — the same on all pages: «Войти» (Sign in) for a guest, an avatar for a signed-in user. */
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
