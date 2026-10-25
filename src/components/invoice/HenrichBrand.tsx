import React from 'react';
import Image from 'next/image';

interface HenrichBrandProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function HenrichBrand({ className = '', size = 'md' }: HenrichBrandProps) {
  const logoDimensions = {
    sm: { smW: 46, smH: 30, henrich: 'text-base sm:text-xl', auto: 'text-[8.5px] sm:text-[10px]', tag: 'text-[6.5px]' },
    md: { smW: 76, smH: 50, henrich: 'text-xl sm:text-2xl md:text-3xl', auto: 'text-[9.5px] sm:text-xs', tag: 'text-[7.5px] sm:text-[8px]' },
    lg: { smW: 96, smH: 64, henrich: 'text-2xl sm:text-3xl md:text-4xl', auto: 'text-xs sm:text-sm font-black', tag: 'text-[8px] sm:text-[9.5px]' },
  }[size];

  return (
    <div className={`flex items-center gap-2 sm:gap-3 select-none ${className}`}>
      <div className="relative shrink-0 overflow-hidden rounded bg-white">
        <Image
          src="/henrich-logo.svg"
          alt="Henrich Automotive Solutions Logo"
          width={logoDimensions.smW}
          height={logoDimensions.smH}
          className="object-contain w-auto h-7 sm:h-9 md:h-11"
          unoptimized
          priority
        />
      </div>

      <div className="flex flex-col leading-none">
        <span className={`font-black tracking-tight text-[#E30613] font-sans ${logoDimensions.henrich}`}>
          HENRICH
        </span>
        <span className={`font-black tracking-wider text-[#073763] uppercase ${logoDimensions.auto} mt-0.5`}>
          AUTOMOTIVE SOLUTIONS
        </span>
        <span className={`hidden sm:block font-bold tracking-tight text-[#073763] ${logoDimensions.tag} mt-1 opacity-90`}>
          SERVICE <span className="text-[#E30613]">|</span> REPAIR <span className="text-[#E30613]">|</span> MAINTENANCE <span className="text-[#E30613]">|</span> DIAGNOSTICS
        </span>
      </div>
    </div>
  );
}
