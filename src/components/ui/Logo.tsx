import Image from "next/image";

export default function Logo({ className, priority }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/logo-white.svg"
      alt="beBeauty DIY"
      width={937}
      height={312}
      priority={priority}
      className={className}
    />
  );
}
