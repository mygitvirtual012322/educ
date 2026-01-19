import React from "react";
import { Menu, Search, User } from "lucide-react";

export function GovHeader() {
    return (
        <header className="bg-white border-b border-gray-200">
            {/* Top Bar (Brasil) */}
            <div className="bg-gov-blue-900 text-white text-xs py-1 px-4">
                <div className="container-centered flex justify-between items-center">
                    <span className="font-bold tracking-wide">BRASIL</span>
                    <span className="opacity-80 hidden sm:block">Acesso à informação</span>
                </div>
            </div>

            {/* Main Header */}
            <div className="container-centered py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Gov.br_logo.svg/500px-Gov.br_logo.svg.png"
                            alt="Gov.br"
                            className="h-7 w-auto object-contain"
                        />
                        <span className="text-xs font-semibold text-gov-yellow-500 uppercase tracking-wider mt-1">
                            Ministério da Educação
                        </span>
                    </div>
                    <div className="hidden md:block h-8 w-px bg-gray-300 mx-2"></div>
                    <h2 className="hidden md:block text-lg font-bold text-gray-700">
                        EducaBank - Cartão Futuro Escolar
                    </h2>
                </div>

                <div className="flex items-center gap-3 sm:gap-6">
                    <button className="flex items-center gap-2 text-gov-blue-800 font-semibold text-sm hover:underline">
                        <span className="hidden sm:inline">Acessar com</span>
                        <span className="font-black">GOV.BR</span>
                        <User className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </header>
    );
}
