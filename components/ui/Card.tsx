import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => (
  <div className={`bg-white shadow-sm border border-gray-200 rounded-lg ${className}`}>
    {children}
  </div>
);