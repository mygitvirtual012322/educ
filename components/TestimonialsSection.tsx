"use client";

import { Star, User, Quote } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const testimonials = [
    {
        name: "Maria Aparecida Silva",
        location: "Belo Horizonte, MG",
        rating: 5,
        quote: "Esse cartão chegou na hora certa! Pude comprar todo o material escolar dos meus dois filhos sem apertar o orçamento. O processo foi muito rápido e prático.",
    },
    {
        name: "João Fernandes",
        location: "Salvador, BA",
        rating: 5,
        quote: "Uma iniciativa maravilhosa. Com o limite liberado, consegui garantir uniformes e cadernos de qualidade para minha filha. Recomendo a todos os pais!",
    },
    {
        name: "Ana Cláudia Santos",
        location: "São Paulo, SP",
        rating: 5,
        quote: "Fiquei surpresa com a facilidade. Fiz o pedido e o cartão chegou direitinho pelos Correios. Já estamos usando e tem ajudado muito nas despesas escolares.",
    },
    {
        name: "Roberto Alves",
        location: "Curitiba, PR",
        rating: 5,
        quote: "O aplicativo é muito fácil de usar. Consegui consultar o saldo e encontrar as papelarias credenciadas perto de casa em poucos minutos.",
    },
    {
        name: "Patrícia Lima",
        location: "Manaus, AM",
        rating: 5,
        quote: "Material escolar completo garantido! Nunca imaginei que seria tão simples. A provação foi quase imediata e o cartão virtual salvou a gente.",
    },
    {
        name: "Carlos Eduardo",
        location: "Rio de Janeiro, RJ",
        rating: 5,
        quote: "Muito bom ver o governo investindo onde realmente importa. Meus filhos estão felizes com as mochilas novas e eu mais tranquilo com as contas.",
    },
    {
        name: "Fernanda Costa",
        location: "Porto Alegre, RS",
        rating: 5,
        quote: "A qualidade dos materiais que conseguimos comprar foi excelente. As lojas credenciadas têm muitas opções. Nota 10 para o programa!",
    },
];

export function TestimonialsSection() {
    return (
        <section className="bg-gray-50 py-16 md:py-24">
            <div className="container-centered">
                <ScrollReveal animation="fade-up">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black text-gov-blue-900 mb-4">
                            O que dizem as famílias beneficiadas
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Veja como o Cartão Futuro Escolar está fazendo a diferença na vida de milhares de estudantes brasileiros.
                        </p>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <ScrollReveal
                            key={index}
                            animation="fade-up"
                            delay={index * 0.15} // Stagger effect
                        >
                            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 h-full flex flex-col relative transition-transform hover:-translate-y-1 hover:shadow-xl duration-300">
                                {/* Quote Icon Background */}
                                <div className="absolute top-6 right-6 text-gov-yellow-400 opacity-20">
                                    <Quote size={48} />
                                </div>

                                {/* Stars */}
                                <div className="flex gap-1 mb-6 text-gov-yellow-400">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="fill-current w-5 h-5" />
                                    ))}
                                </div>

                                {/* Quote Text */}
                                <blockquote className="flex-grow mb-6">
                                    <p className="text-gray-700 italic leading-relaxed">
                                        "{testimonial.quote}"
                                    </p>
                                </blockquote>

                                {/* User Info */}
                                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-gray-100">
                                    <div className="bg-gov-blue-100 p-3 rounded-full text-gov-blue-700">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gov-blue-900 text-sm">{testimonial.name}</h4>
                                        <p className="text-xs text-gray-500">{testimonial.location}</p>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
