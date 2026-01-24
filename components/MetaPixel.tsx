"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";

export const META_PIXEL_ID = "1508502797047309";

export const FacebookPixel = () => {
    const pathname = usePathname();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!loaded) return;
        // PageView is tracked automatically by the snippet, but we can re-trigger on route change if needed
        // standard snippet tracks PageView on load.
        // For SPA transitions, we might want to track manually, but standard behavior is usually sufficient for "Landing Page" request.
        // However, user specifically asked: "PageView na Landing Page".

        import("react-facebook-pixel")
            .then((x) => x.default)
            .then((ReactPixel) => {
                ReactPixel.init(META_PIXEL_ID);
                ReactPixel.pageView();
            });
    }, [pathname, loaded]);

    return (
        <div>
            <Script
                id="fb-pixel"
                src="https://connect.facebook.net/en_US/fbevents.js"
                onLoad={() => setLoaded(true)}
                strategy="afterInteractive"
            />
            <Script id="fb-pixel-init" strategy="afterInteractive">
                {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
            </Script>
        </div>
    );
};
