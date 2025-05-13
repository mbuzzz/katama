
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children, className, ...props }: PageHeaderProps) {
  return (
    <div className={cn('space-y-2 pb-4 md:pb-6 pt-2 md:pt-4', className)} {...props}> {/* Adjusted padding */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
          {description && <p className="text-sm text-muted-foreground md:text-base">{description}</p>}
        </div>
        {children && <div className="flex items-center space-x-2 self-start md:self-center">{children}</div>}
      </div>
    </div>
  );
}
