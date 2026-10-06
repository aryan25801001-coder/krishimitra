import Link from "next/link";
import { Phone } from "lucide-react";

export default function FloatingContact() {
  return (
    <Link
      id="floating-contact"
      href="/contact"
      aria-label="Contact us"
    >
      <Phone size={16} strokeWidth={2.5} />
      Contact
    </Link>
  );
}
