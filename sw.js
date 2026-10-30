/* =====================================================
   KULZZY RADIO NETWORK
   SERVICE WORKER
   VERSION 9
   NETWORK UPDATES + OFFLINE FALLBACK
===================================================== */

const CACHE_NAME = "kulzzy-radio-app-v9";

const APP_SHELL = [
    "./",
    "./index.html",
    "./manifest.json",
    "./install.js",
    "./icon-192.png",
    "./icon-512.png",
    "./logo.jpg"
];

/* =====================================================
   INSTALL
===================================================== */

self.addEventListener("install", function (event) {
    event.waitUntil(
        (async function () {
            const cache = await caches.open(CACHE_NAME);

            /*
               Cache each available file independently.
               One missing optional file will not prevent
               the remaining files from being cached.
            */
            await Promise.all(
                APP_SHELL.map(async function (file) {
                    try {
                        const response = await fetch(file, {
                            cache: "no-store"
                        });

                        if (response.ok) {
                            await cache.put(file, response);
                        } else {
                            console.warn(
                                "Kulzzy cache skipped:",
                                file,
                                response.status
                            );
                        }
                    } catch (error) {
                        console.warn(
                            "Kulzzy could not cache:",
                            file
                        );
                    }
                })
            );

            await self.skipWaiting();
        })()
    );
});

/* =====================================================
   ACTIVATE
===================================================== */

self.addEventListener("activate", function (event) {
    event.waitUntil(
        (async function () {
            const cacheNames = await caches.keys();

            await Promise.all(
                cacheNames.map(function (name) {
                    if (
                        name.startsWith("kulzzy-radio-app-") &&
                        name !== CACHE_NAME
                    ) {
                        return caches.delete(name);
                    }

                    return Promise.resolve(false);
                })
            );

            await self.clients.claim();
        })()
    );
});

/* =====================================================
   FETCH
===================================================== */

self.addEventListener("fetch", function (event) {
    const request = event.request;

    if (request.method !== "GET") {
        return;
    }

    const url = new URL(request.url);

    /*
       Do not intercept external radio streams, embedded
       pages, or third-party services.
    */
    if (url.origin !== self.location.origin) {
        return;
    }

    /*
       HTML pages: network first, cached page if offline.
    */
    if (
        request.mode === "navigate" ||
        request.destination === "document"
    ) {
        event.respondWith(
            (async function () {
                try {
                    const response = await fetch(request, {
                        cache: "no-store"
                    });

                    if (response && response.ok) {
                        const cache = await caches.open(CACHE_NAME);

                        await cache.put(
                            request,
                            response.clone()
                        );
                    }

                    return response;
                } catch (error) {
                    const cachedPage = await caches.match(request);

                    if (cachedPage) {
                        return cachedPage;
                    }

                    const homePage = await caches.match("./index.html");

                    if (homePage) {
                        return homePage;
                    }

                    return new Response(
                        "Kulzzy Radio is offline. Please reconnect to the internet and try again.",
                        {
                            status: 503,
                            headers: {
                                "Content-Type": "text/plain; charset=utf-8"
                            }
                        }
                    );
                }
            })()
        );

        return;
    }

    /*
       Static files: network first, cache fallback.
    */
    event.respondWith(
        (async function () {
            try {
                const response = await fetch(request, {
                    cache: "no-store"
                });

                if (response && response.ok) {
                    const cache = await caches.open(CACHE_NAME);

                    await cache.put(
                        request,
                        response.clone()
                    );
                }

                return response;
            } catch (error) {
                const cachedResponse = await caches.match(request);

                if (cachedResponse) {
                    return cachedResponse;
                }

                return Response.error();
            }
        })()
    );
});

/* =====================================================
   MESSAGE CONTROL
===================================================== */

self.addEventListener("message", function (event) {
    if (
        event.data &&
        event.data.type === "SKIP_WAITING"
    ) {
        self.skipWaiting();
    }
});
