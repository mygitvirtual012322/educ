"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
    children: ReactNode;
    animation?: "fade-up" | "fade-in" | "slide-right" | "scale-up";
    delay?: number;
    duration?: number;
    className?: string;
}

export function ScrollReveal({
    children,
    animation = "fade-up",
    delay = 0,
    duration = 0.5,
    className = "",
}: ScrollRevealProps) {
    const animations = {
        "fade-up": {
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
        },
        "fade-in": {
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
        },
        "slide-right": {
            hidden: { opacity: 0, x: -30 },
            visible: { opacity: 1, x: 0 },
        },
        "scale-up": {
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1 },
        },
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration, delay, ease: "easeOut" }}
            variants={animations[animation]}
            className={className}
        >
            {children}
        </motion.div>
    );
}
