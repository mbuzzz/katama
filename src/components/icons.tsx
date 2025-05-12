import { Warehouse } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

export const Logo = (props: LucideProps) => (
  <div className="flex items-center gap-2" aria-label="Logo KATAMA POS">
    <Warehouse className="h-6 w-6 text-primary-foreground" {...props} />
    <span className="font-semibold text-lg text-primary-foreground">KATAMA</span>
  </div>
);
