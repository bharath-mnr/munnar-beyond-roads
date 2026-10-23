//src/components/WhatsAppButton.jsx
import { MessageCircle } from "lucide-react";

import { whatsappLink } from "@/data/site";

export default function WhatsAppButton() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed right-4 bottom-4 z-30 sm:right-6 sm:bottom-6"
    >
      <span className="absolute inset-0 hidden animate-ping rounded-full bg-[#25d366]/40 motion-reduce:hidden lg:block" />
      <span className="relative flex size-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-xl shadow-black/25 transition-transform duration-300 group-hover:scale-110">
        <MessageCircle className="size-6" />
      </span>
    </a>
  );
}
