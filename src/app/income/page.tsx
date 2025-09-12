import { redirect } from "next/navigation";

export default function IncomePage() {
  // Redirect to transactions page as income is tracked there
  redirect("/transactions");
}
