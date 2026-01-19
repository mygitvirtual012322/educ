import { Facebook, Instagram, Twitter, Youtube, Phone, Mail, MapPin, ExternalLink } from "lucide-react";

export function GovFooter() {
    return (
        <footer className="bg-gov-blue-900 text-white pt-16 pb-8 border-t border-gov-blue-800">
            <div className="container-centered">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Column 1: Brand & Gov */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <img
                                src="/educabank.png"
                                alt="EducaBank"
                                className="h-10 w-auto brightness-0 invert"
                            />
                        </div>
                        <p className="text-blue-200 text-sm leading-relaxed mb-6">
                            O Programa EducaBank - Cartão Futuro Escolar é uma iniciativa do Governo Federal para garantir o acesso à educação de qualidade para todos.
                        </p>
                        <div className="flex gap-4">
                            <SocialIcon icon={<Instagram className="h-5 w-5" />} />
                            <SocialIcon icon={<Facebook className="h-5 w-5" />} />
                            <SocialIcon icon={<Twitter className="h-5 w-5" />} />
                            <SocialIcon icon={<Youtube className="h-5 w-5" />} />
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-6 text-white border-b border-blue-800 pb-2 inline-block">Acesso Rápido</h3>
                        <ul className="space-y-3 text-sm text-blue-200">
                            <li><a href="#" className="hover:text-white hover:underline transition-colors">Portal do Aluno</a></li>
                            <li><a href="#" className="hover:text-white hover:underline transition-colors">Rede Credenciada</a></li>
                            <li><a href="#" className="hover:text-white hover:underline transition-colors">Consulta de Saldo</a></li>
                            <li><a href="#" className="hover:text-white hover:underline transition-colors">Desbloqueio de Cartão</a></li>
                            <li><a href="#" className="hover:text-white hover:underline transition-colors">Edital 2026</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Legal & Help */}
                    <div>
                        <h3 className="font-bold text-lg mb-6 text-white border-b border-blue-800 pb-2 inline-block">Ajuda e Legal</h3>
                        <ul className="space-y-3 text-sm text-blue-200">
                            <li><a href="#" className="hover:text-white hover:underline transition-colors">Termos de Uso</a></li>
                            <li><a href="#" className="hover:text-white hover:underline transition-colors">Política de Privacidade</a></li>
                            <li><a href="#" className="hover:text-white hover:underline transition-colors">Perguntas Frequentes</a></li>
                            <li><a href="#" className="hover:text-white hover:underline transition-colors">Ouvidoria</a></li>
                            <li><a href="#" className="hover:text-white hover:underline transition-colors">Portal da Transparência</a></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div>
                        <h3 className="font-bold text-lg mb-6 text-white border-b border-blue-800 pb-2 inline-block">Fale Conosco</h3>
                        <ul className="space-y-4 text-sm text-blue-200">
                            <li className="flex items-start gap-3">
                                <Phone className="h-5 w-5 text-gov-yellow-400 mt-0.5" />
                                <div>
                                    <p className="font-bold text-white">0800 61 61 61</p>
                                    <p className="text-xs">Segunda a Sexta, das 8h às 20h</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail className="h-5 w-5 text-gov-yellow-400 mt-0.5" />
                                <div>
                                    <p className="font-bold text-white">suporte@educabank.gov.br</p>
                                    <p className="text-xs">Atendimento geral</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-gov-yellow-400 mt-0.5" />
                                <div>
                                    <p>Esplanada dos Ministérios, Bloco L</p>
                                    <p>Brasília - DF, 70047-900</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-blue-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-blue-300">
                    <div className="flex items-center gap-4">
                        <img src="/govbr-logo-large.png" alt="Gov.br" className="h-10 w-auto opacity-90" />
                        <span>© 2026 Governo Federal do Brasil. Todos os direitos reservados.</span>
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-white transition-colors">Mapa do Site</a>
                        <a href="#" className="hover:text-white transition-colors">Acessibilidade</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
    return (
        <a href="#" className="bg-blue-800 p-2 rounded-lg hover:bg-gov-yellow-400 hover:text-gov-blue-900 transition-all duration-300">
            {icon}
        </a>
    );
}
