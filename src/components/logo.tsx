import Image from "next/image"

export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="Threads Extractor Logo"
      width={64}
      height={64}
      className={className}
    />
  )
}