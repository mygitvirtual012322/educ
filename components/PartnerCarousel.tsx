"use client";

const partners = [
    { name: "Kalunga", logo: "/kalunga-logo.png" },
    { name: "Saraiva", logo: "/saraiva-logo.png" },
    { name: "Americanas", logo: "/americanas-real.png" },
    { name: "Amazon", logo: "/amazon-real.png" },
    { name: "Magazine Luiza", logo: "/magalu-logo.png" },
    { name: "Mercado Livre", logo: "/mercadolivre-logo.png" },
];

export function PartnerCarousel({ className = "", title = "Nossas Parceiras" }: { className?: string, title?: string }) {
    return (
        <div className={`w-full py-10 ${className}`}>

            {title && (
                <div className="text-center mb-8">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{title}</p>
                </div>
            )}

            <div className="relative flex overflow-x-hidden">
                <div className="animate-scroll-logos flex items-center space-x-16 whitespace-nowrap py-6">
                    {/* First set */}
                    {partners.map((partner, idx) => (
                        <div key={`${partner.name}-${idx}`} className="flex items-center justify-center min-w-[200px] h-24 px-6 opacity-50 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                            <img
                                src={partner.logo}
                                alt={partner.name}
                                className="h-full w-full object-contain max-h-20"
                            />
                        </div>
                    ))}

                    {/* Duplicate set */}
                    {partners.map((partner, idx) => (
                        <div key={`${partner.name}-dup-${idx}`} className="flex items-center justify-center min-w-[200px] h-24 px-6 opacity-50 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                            <img
                                src={partner.logo}
                                alt={partner.name}
                                className="h-full w-full object-contain max-h-20"
                            />
                        </div>
                    ))}

                    {/* Triplicate set */}
                    {partners.map((partner, idx) => (
                        <div key={`${partner.name}-tri-${idx}`} className="flex items-center justify-center min-w-[200px] h-24 px-6 opacity-50 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                            <img
                                src={partner.logo}
                                alt={partner.name}
                                className="h-full w-full object-contain max-h-20"
                            />
                        </div>
                    ))}
                </div>

                {/* Gradient overlays */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>
            </div>
        </div>
    );
}
