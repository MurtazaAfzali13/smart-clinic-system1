import { getCurrentUser, ROLE_HOME } from "@/lib/auth/dal";
import { Navbar } from "./Navbar";

export async function SiteNavbar() {
  const user = await getCurrentUser();

  return (
    <Navbar
      user={
        user
          ? {
              displayName: user.fullName.trim() || user.email.split("@")[0],
              dashboardPath: ROLE_HOME[user.role],
            }
          : null
      }
    />
  );
}