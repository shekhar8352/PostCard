"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const LoadingBar = () => {
    const [loading, setLoading] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        setLoading(false);
    }, [pathname, searchParams]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const anchor = target.closest("a");

            if (anchor && anchor.href && !anchor.href.startsWith("#")) {
                const url = new URL(anchor.href);
                if (url.pathname !== pathname) {
                    setLoading(true);
                }
            }
        };

        document.addEventListener("click", handleClick, true);
        return () => document.removeEventListener("click", handleClick, true);
    }, [pathname]);

    if (!loading) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
            <div className="h-full bg-primary-500 animate-loading-bar origin-left" />
        </div>
    );
};

export default LoadingBar;
