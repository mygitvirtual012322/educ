"use client";

import Image from "next/image";

const partners = [
    { name: "Kalunga", logo: "/kalunga.png" },
    { name: "Saraiva", logo: "/saraiva.png" },
    { name: "Americanas", logo: "/americanas.png" },
    { name: "Amazon", logo: "/amazon.png" },
    { name: "Magazine Luiza", logo: "/magalu.png" },
    { name: "Mercado Livre", logo: "/mercadolivre.png" },
];

export function PartnerCarousel({ className = "", title = "Nossas Parceiras" }: { className?: string, title?: string }) {
    return (
        <div className={`w-full py-8 ${className}`}>

            {title && (
                <div className="text-center mb-6">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{title}</p>
                </div>
            )}

            <div className="relative flex overflow-x-hidden group">
                {/* Duration adjusted for smooth flow with 6 items * 3 sets */}
                <div className="animate-scroll-logos flex items-center space-x-16 whitespace-nowrap py-4">
                    {/* First set of logos */}
                    {partners.map((partner, idx) => (
                        <div key={`${partner.name}-${idx}`} className="flex items-center justify-center min-w-[140px] h-16 transition-all duration-300 transform hover:scale-110 cursor-pointer grayscale opacity-40 hover:grayscale-0 hover:opacity-100">
                            <img
                                src={partner.logo}
                                alt={partner.name}
                                className="h-full w-auto object-contain max-h-12"
                            />
                        </div>
                    ))}

                    {/* Duplicate set for seamless scrolling */}
                    {partners.map((partner, idx) => (
                        <div key={`${partner.name}-duplicate-${idx}`} className="flex items-center justify-center min-w-[140px] h-16 transition-all duration-300 transform hover:scale-110 cursor-pointer grayscale opacity-40 hover:grayscale-0 hover:opacity-100">
                            <img
                                src={partner.logo}
                                alt={partner.name}
                                className="h-full w-auto object-contain max-h-12"
                            />
                        </div>
                    ))}

                    {/* Triplicate set for wider screens safety */}
                    {partners.map((partner, idx) => (
                        <div key={`${partner.name}-triplicate-${idx}`} className="flex items-center justify-center min-w-[140px] h-16 transition-all duration-300 transform hover:scale-110 cursor-pointer grayscale opacity-40 hover:grayscale-0 hover:opacity-100">
                            <img
                                src={partner.logo}
                                alt={partner.name}
                                className="h-full w-auto object-contain max-h-12"
                            />
                        </div>
                    ))}
                </div>

                {/* Gradient overlays for fade effect */}
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>
            </div>
        </div>
    );
}
