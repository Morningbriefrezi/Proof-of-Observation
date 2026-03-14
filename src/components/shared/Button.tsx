import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'solana' | 'ghost' | 'cyan' | 'brass';
  children: ReactNode;
}

const variants = {
  primary: 'btn-primary',
  brass: 'btn-primary',
  solana: 'bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-[#8030ee] hover:to-[#10d080] text-white font-semibold rounded-xl shadow-lg hover:shadow-[0_4px_20px_rgba(153,69,255,0.35)] hover:-translate-y-px',
  cyan: 'bg-gradient-to-r from-[#0e7490] to-[#22d3ee] hover:from-[#0a5f78] hover:to-[#18b8d4] text-white font-semibold rounded-xl shadow-lg hover:-translate-y-px',
  ghost: 'btn-ghost',
};

export default function Button({ variant = 'primary', children, className = '', disabled, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`
        px-4 py-2.5 transition-all duration-200 font-medium
        ${variants[variant]}
        ${disabled ? 'opacity-40 cursor-not-allowed !transform-none !shadow-none' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
