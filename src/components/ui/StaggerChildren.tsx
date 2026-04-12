'use client';

import React from 'react';

interface StaggerChildrenProps {
  children: React.ReactNode;
  baseDelay?: number;
  stagger?: number;
  animation?: 'fade-in' | 'slide-up' | 'scale-in';
  className?: string;
}

export default function StaggerChildren({
  children,
  baseDelay = 80,
  stagger = 80,
  animation = 'slide-up',
  className = '',
}: StaggerChildrenProps) {
  const items = React.Children.toArray(children);
  const animClass = `animate-${animation}`;

  return (
    <div className={className}>
      {items.map((child, index) => (
        <div
          key={index}
          className={animClass}
          style={{ animationDelay: `${baseDelay + index * stagger}ms`, opacity: 0 }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
