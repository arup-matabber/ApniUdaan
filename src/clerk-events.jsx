import { useEffect } from "react";
import { useClerk } from "@clerk/clerk-react";

export default function ClerkEventsRedirect() {
  const { addListener } = useClerk();

  useEffect(() => {
    const stop = addListener(({ type, user }) => {
      // Trigger redirect only after new signup completes
      if (
        type === "user.updated" &&
        user &&
        window.location.pathname !== "/profile/form"
      ) {
        window.location.href = "/profile/form";
      }
    });

    return stop;
  }, []);

  return null;
}
