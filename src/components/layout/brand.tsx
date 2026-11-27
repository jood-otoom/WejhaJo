import Link from "next/link";
import Image from "next/image";

export function Brand() {
  return (
    <Link href="/#home" className="brand" aria-label="Wejha home">
      <Image
        src="/brand/wejha-logo.png"
        width={2172}
        height={724}
        alt=""
        priority
      />
    </Link>
  );
}
