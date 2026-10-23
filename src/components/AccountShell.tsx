import { Suspense, type ReactNode } from "react";
import { getCurrentUser } from "@/lib/session";
import { AccountMenu } from "./AccountMenu";
import { Header } from "./Header";
import styles from "./AccountShell.module.css";

/** Account header and menu. Without sign-in — redirect to /login (inside getCurrentUser). */
export function AccountShell({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <Shell>{children}</Shell>
    </Suspense>
  );
}

async function Shell({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  return (
    <>
      <Header />
      <main className={`container ${styles.layout}`}>
        <AccountMenu isAdmin={user.role === "ADMIN"} />
        <div>{children}</div>
      </main>
    </>
  );
}
