import Link from "next/link";
import Image from "next/image";

export function Brand() {
  return (
    <Link href="/#home" className="brand" aria-label="Wejha home">
      <span className="brand-mark">
        <Image src="/brand/wejha-mark.webp" width={42} height={25} alt="" />
      </span>
      <span>wejha</span>
    </Link>
  );
}
