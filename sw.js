/* =========================================================
   KULZZY RADIO NETWORK
   SERVICE WORKER
   VERSION 8
   LIVE + FAST + RELIABLE UPDATES
========================================================= */

const CACHE_NAME = "kulzzy-radio-app-v8";

const APP_SHELL = [
    "./",
    "./index.html",
    "./manifest.json",
    "./install.js",
    "./icon-192.png"
];


/* =========================================================
   INSTALL
========================================================= */

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)

            .then(cache => {

                return cache.addAll(APP_SHELL);

            })

            .catch(error => {

                console.error(
                    "Kulzzy Service Worker install error:",
                    error
                );

            })

    );

    /*
       Activate immediately.
    */
    self.skipWaiting();

});


/* =========================================================
   ACTIVATE
========================================================= */

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()

            .then(cacheNames => {

                return Promise.all(

                    cacheNames.map(cacheName => {

                        if(
                            cacheName.startsWith(
                                "kulzzy-radio-app-"
                            ) &&
                            cacheName !== CACHE_NAME
                        ){

                            return caches.delete(
                                cacheName
                            );

                        }

                        return null;

                    })

                );

            })

            .then(() => {

                /*
                   Take control of all open pages.
                */
                return self.clients.claim();

            })

    );

});


/* =========================================================
   FETCH
========================================================= */

self.addEventListener("fetch", event => {

    const request = event.request;

    if(request.method !== "GET"){

        return;

    }


    const url = new URL(
        request.url
    );


    /* =====================================================
       EXTERNAL REQUESTS

       Firebase
       Google
       Radio server
       Iframes
       External APIs

       Do not cache these.
    ===================================================== */

    if(
        url.origin !== self.location.origin
    ){

        event.respondWith(

            fetch(
                request,
                {
                    cache: "no-store"
                }
            )

                .catch(() => {

                    return Response.error();

                })

        );

        return;

    }


    /* =====================================================
       HTML / NAVIGATION

       ALWAYS TRY NETWORK FIRST.

       This makes changes to index.html appear immediately
       when internet is available.
    ===================================================== */

    if(
        request.mode === "navigate" ||
        request.destination === "document"
    ){

        event.respondWith(

            fetch(
                request,
                {
                    cache: "no-store"
                }
            )

                .then(response => {

                    if(
                        response &&
                        response.ok
                    ){

                        caches.open(
                            CACHE_NAME
                        )

                        .then(cache => {

                            cache.put(
                                request,
                                response.clone()
                            );

                        });

                    }

                    return response;

                })

                .catch(() => {

                    return caches.match(
                        request
                    )

                        .then(cachedPage => {

                            if(cachedPage){

                                return cachedPage;

                            }

                            return caches.match(
                                "./index.html"
                            );

                        });

                })

        );

        return;

    }


    /* =====================================================
       SAME-ORIGIN STATIC FILES

       JavaScript
       CSS
       Images
       Manifest
       Icons
       JSON
       Fonts

       NETWORK FIRST

       This is intentionally different from the old
       Cache First behaviour.

       The newest file is requested first whenever
       internet is available.
    ===================================================== */

    event.respondWith(

        fetch(
            request,
            {
                cache: "no-store"
            }
        )

            .then(networkResponse => {

                if(
                    networkResponse &&
                    networkResponse.ok
                ){

                    caches.open(
                        CACHE_NAME
                    )

                    .then(cache => {

                        cache.put(
                            request,
                            networkResponse.clone()
                        );

                    });

                }

                return networkResponse;

            })

            .catch(() => {

                /*
                   If internet is unavailable,
                   use the cached version.
                */

                return caches.match(
                    request
                )

                    .then(cachedResponse => {

                        if(cachedResponse){

                            return cachedResponse;

                        }

                        return Response.error();

                    });

            })

    );

});


/* =========================================================
   MESSAGE CONTROL
========================================================= */

self.addEventListener(
    "message",
    event => {

        if(!event.data){

            return;

        }


        if(
            event.data.type ===
            "SKIP_WAITING"
        ){

            self.skipWaiting();

        }

    }
);
