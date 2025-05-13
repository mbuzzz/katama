import { Warehouse } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  customLogoUrl?: string | null;
  className?: string;
  companyName?: string; // Added companyName prop
}

export const Logo = ({ customLogoUrl, className, companyName = "KATAMA" }: LogoProps) => {
  if (customLogoUrl) {
    return (
      <Image
        src={customLogoUrl}
        alt="Logo Perusahaan"
        width={120} 
        height={30} 
        className={cn("object-contain", className)}
        priority 
      />
    );
  }

  // Default fallback logo
  return (
    <div className={cn("flex items-center gap-2", className)} aria-label={`Logo ${companyName} POS`}>
      <Warehouse className={cn("h-6 w-6 text-[hsl(var(--accent))]", className)} /> {/* Icon color set to accent (yellow) */}
      <span className="font-bold text-xl animated-logo-text">{companyName}</span> {/* Applied animation class and made font bold and larger */}
    </div>
  );
};
