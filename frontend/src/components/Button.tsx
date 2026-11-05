import type { ReactNode } from "react";

interface ButtonProps {
    href?: string;
    children: ReactNode;
}

export default function Button({href, children}: ButtonProps) {
    return (
        <a className="btn" href={href}>
            {children}
            <svg
                className="btn__icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true">
                    <path d="M7 17 17 7M8 7h9v9"/>
            </svg>
        </a>
    );
}
