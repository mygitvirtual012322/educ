"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface PulsingButtonProps {
    href: string;
    children: ReactNode;
    className?: string;
    pulseColor?: string;
}

export function PulsingButton({ href, children, className = "", pulseColor = "bg-gov-yellow-400" }: PulsingButtonProps) {
    return (
        <div className="relative inline-flex group">
            {/* External Pulse Ring */}
            <span className={`absolute -inset-2 rounded-lg opacity-10 animate-pulse ${pulseColor}`}></span>

            {/* Actual Button */}
            <Link href={href} className={`relative z-10 ${className}`}>
                {children}
            </Link>
        </div>
    );
}
