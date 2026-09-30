import Image from "next/image";

export function DoctorPhoto({
  src,
  alt,
  initial,
  sizes,
  priority = false,
  className = "",
}: {
  src: string | null;
  alt: string;
  initial: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (!src) {
    return (
      <div
        className={`gradient-surface flex items-center justify-center text-6xl font-bold text-primary-foreground ${className}`}
      >
        {initial}
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover object-top"
      />
    </div>
  );
}