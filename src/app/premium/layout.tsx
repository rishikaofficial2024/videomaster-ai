
import { AuthGuard } from "@/components/auth-guard";

export default function PremiumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
