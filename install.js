/* =====================================================
   KULZZY RADIO NETWORK
   UNIVERSAL INSTALL SUPPORT
   Works with the existing installation screen in index.html
   Does not create a second installation screen.
===================================================== */

(function () {
    "use strict";

    let deferredInstallPrompt = null;

    const installedKey = "kulzzyRadioInstalled";

    function isInstalled() {
        try {
            if (localStorage.getItem(installedKey) === "true") {
                return true;
            }
        } catch (error) {
            // Continue with browser-based detection.
        }

        if (
            window.matchMedia &&
            (
                window.matchMedia("(display-mode: standalone)").matches ||
                window.matchMedia("(display-mode: fullscreen)").matches
            )
        ) {
            return true;
        }

        return Boolean(
            window.navigator &&
            window.navigator.standalone === true
        );
    }

    function rememberInstallation() {
        try {
            localStorage.setItem(installedKey, "true");
        } catch (error) {
            console.log("Installation status could not be saved.");
        }

        const startup = document.getElementById(
            "kulzzyImmediateStartup"
        );

        if (startup) {
            startup.remove();
        }
    }

    function isIOS() {
        return /iphone|ipad|ipod/i.test(
            navigator.userAgent || ""
        );
    }

    function isAndroid() {
        return /android/i.test(
            navigator.userAgent || ""
        );
    }

    /*
       Receive the browser's native installation prompt.
    */
    window.addEventListener("beforeinstallprompt", function (event) {
        event.preventDefault();

        deferredInstallPrompt = event;
        window.kulzzyInstallPrompt = event;

        console.log("Kulzzy Radio installation prompt is ready.");
    });

    /*
       Called by the existing INSTALL APP button in index.html.
    */
    window.kulzzyInstallApp = async function () {
        if (isInstalled()) {
            rememberInstallation();
            return;
        }

        if (deferredInstallPrompt) {
            try {
                deferredInstallPrompt.prompt();

                const result = await deferredInstallPrompt.userChoice;

                console.log(
                    "Kulzzy Radio installation result:",
                    result.outcome
                );

                if (result.outcome === "accepted") {
                    rememberInstallation();
                }
            } catch (error) {
                console.error("Installation prompt error:", error);

                alert(
                    "The installation prompt could not open. " +
                    "Please use your browser menu to install Kulzzy Radio."
                );
            } finally {
                deferredInstallPrompt = null;
                window.kulzzyInstallPrompt = null;
            }

            return;
        }

        /*
           iPhone and iPad installation is manual.
        */
        if (isIOS()) {
            alert(
                "TO INSTALL KULZZY RADIO ON IPHONE OR IPAD:\n\n" +
                "1. Open this website in your browser.\n" +
                "2. Tap the Share button.\n" +
                "3. Choose Add to Home Screen.\n" +
                "4. Enable Open as Web App if shown.\n" +
                "5. Tap Add.\n\n" +
                "If Add to Home Screen is missing, look under " +
                "Edit Actions in the Share menu."
            );

            return;
        }

        /*
           Android manual installation.
        */
        if (isAndroid()) {
            alert(
                "TO INSTALL KULZZY RADIO ON ANDROID:\n\n" +
                "1. Open this website in Chrome or another supported browser.\n" +
                "2. Tap the browser menu ⋮.\n" +
                "3. Choose Install app or Add to Home screen.\n" +
                "4. Follow the instructions shown by your phone.\n\n" +
                "If the option is missing, update your browser " +
                "and open the website directly rather than inside another app."
            );

            return;
        }

        /*
           Desktop installation.
        */
        alert(
            "TO INSTALL KULZZY RADIO ON YOUR COMPUTER:\n\n" +
            "Open this website in a supported browser such as Chrome or Edge.\n" +
            "Open the browser menu and choose Install Kulzzy Radio or Install.\n\n" +
            "If the option is not available, the browser may not support " +
            "installation on this device or the website may not meet its criteria."
        );
    };

    /*
       When installation succeeds, close the existing install screen.
    */
    window.addEventListener("appinstalled", function () {
        deferredInstallPrompt = null;
        window.kulzzyInstallPrompt = null;

        rememberInstallation();

        console.log("Kulzzy Radio was installed.");
    });

    /*
       If the app is already running as an installed web app,
       remove the startup installation screen.
    */
    function checkInstalledState() {
        if (isInstalled()) {
            const startup = document.getElementById(
                "kulzzyImmediateStartup"
            );

            if (startup) {
                startup.remove();
            }
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            checkInstalledState
        );
    } else {
        checkInstalledState();
    }
})();
