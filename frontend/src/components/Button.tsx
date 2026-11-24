import type { ReactNode } from "react";
import { Link } from "react-router";


interface ButtonProps {
    href: string;
    children: ReactNode;
    arrow?: boolean;      // show the ↗ icon (default: yes)
    ariaLabel?: string;   // accessible name when children isn't readable text (e.g. "+")
    className?: string;   // extra classes, added after "btn"
}

export default function Button({href, children, arrow = true, ariaLabel, className}: ButtonProps) {
    return (
        <Link className={className ? `btn ${className}` : "btn"} to={href} aria-label={ariaLabel}>
            {children}
            {arrow && <svg
                className="btn__icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true">
                    <path d="M7 17 17 7M8 7h9v9"/>
            </svg>}
        </Link>
    );
}
