import { Warehouse } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  customLogoUrl?: string | null;
  className?: string;
}

export const Logo = ({ customLogoUrl, className }: LogoProps) => {
  if (customLogoUrl) {
    return (
      <Image
        src={customLogoUrl}
        alt="Logo Perusahaan"
        width={120} // Adjusted for better display in sidebar header
        height={30} // Adjusted for better display in sidebar header
        className={cn("object-contain", className)}
        priority // Prioritize loading the logo
      />
    );
  }

  // Default fallback logo
  return (
    <div className={cn("flex items-center gap-2", className)} aria-label="Logo KATAMA POS">
      {/* Ensure icon color contrasts with sidebar background (controlled by --primary-foreground and --sidebar-background) */}
      <Warehouse className={cn("h-6 w-6 text-primary-foreground", className)} />
      <span className="font-semibold text-lg text-primary-foreground">KATAMA</span>
    </div>
  );
};
