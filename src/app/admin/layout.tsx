import { AccountShell } from "@/components/AccountShell";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <AccountShell>{children}</AccountShell>;
}
