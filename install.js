(function () {

    "use strict";


    /* =====================================================
       KULZZY RADIO NETWORK
       UNIVERSAL INSTALL SYSTEM
    ===================================================== */


    var deferredInstallPrompt = null;


    /* =====================================================
       INSTALLED CHECK
    ===================================================== */

    function isInstalled() {

        /* -----------------------------------------------
           REMEMBER SUCCESSFUL INSTALLATION
        ----------------------------------------------- */

        try {

            if (
                localStorage.getItem(
                    "kulzzyRadioInstalled"
                ) === "true"
            ) {

                return true;

            }

        }
        catch (error) {

            console.log(
                "Kulzzy installation storage check:",
                error
            );

        }


        /* -----------------------------------------------
           ANDROID / CHROME / CHROMIUM
        ----------------------------------------------- */

        if (
            window.matchMedia &&
            window.matchMedia(
                "(display-mode: standalone)"
            ).matches
        ) {

            return true;

        }


        /* -----------------------------------------------
           FULLSCREEN
        ----------------------------------------------- */

        if (
            window.matchMedia &&
            window.matchMedia(
                "(display-mode: fullscreen)"
            ).matches
        ) {

            return true;

        }


        /* -----------------------------------------------
           IOS
        ----------------------------------------------- */

        if (
            window.navigator &&
            window.navigator.standalone === true
        ) {

            return true;

        }


        return false;

    }


    /* =====================================================
       REMOVE ALL KULZZY INSTALL SCREENS
    ===================================================== */

    function removeInstallScreens() {

        var startup =
            document.getElementById(
                "kulzzyImmediateStartup"
            );


        if (startup) {

            startup.remove();

        }


        var screen =
            document.getElementById(
                "kulzzyInstallScreen"
            );


        if (screen) {

            screen.remove();

        }

    }


    /* =====================================================
       REMEMBER INSTALLATION
    ===================================================== */

    function rememberInstallation() {

        try {

            localStorage.setItem(
                "kulzzyRadioInstalled",
                "true"
            );

        }
        catch (error) {

            console.log(
                "Kulzzy installation storage error:",
                error
            );

        }


        removeInstallScreens();

    }


    /* =====================================================
       IOS CHECK
    ===================================================== */

    function isIOS() {

        return /iphone|ipad|ipod/i.test(
            navigator.userAgent
        );

    }


    /* =====================================================
       IOS SAFARI CHECK
    ===================================================== */

    function isIOSSafari() {

        var ua =
            navigator.userAgent ||
            "";


        var ios =
            /iphone|ipad|ipod/i.test(ua);


        var webkit =
            /webkit/i.test(ua);


        var chrome =
            /crios/i.test(ua);


        var firefox =
            /fxios/i.test(ua);


        return (
            ios &&
            webkit &&
            !chrome &&
            !firefox
        );

    }


    /* =====================================================
       ANDROID CHECK
    ===================================================== */

    function isAndroid() {

        return /android/i.test(
            navigator.userAgent
        );

    }


    /* =====================================================
       DESKTOP CHECK
    ===================================================== */

    function isDesktop() {

        return !isAndroid() &&
               !isIOS();

    }


    /* =====================================================
       BEFORE INSTALL PROMPT
    ===================================================== */

    window.addEventListener(
        "beforeinstallprompt",
        function (event) {

            event.preventDefault();

            deferredInstallPrompt = event;

            window.kulzzyInstallPrompt =
                event;


            var button =
                document.getElementById(
                    "kulzzyInstallButton"
                );


            if (button) {

                button.innerHTML =
                    "📲 INSTALL APP";

                button.style.display =
                    "block";

            }


            var message =
                document.getElementById(
                    "kulzzyInstallMessage"
                );


            if (message) {

                message.innerHTML =
                    "Install Kulzzy Radio on your device for quick and easy access.";

            }

        },
        false
    );


    /* =====================================================
       CREATE INSTALL SCREEN
    ===================================================== */

    function createInstallScreen() {

        if (isInstalled()) {

            removeInstallScreens();

            return;

        }


        if (
            document.getElementById(
                "kulzzyInstallScreen"
            )
        ) {

            return;

        }


        var screen =
            document.createElement("div");


        screen.id =
            "kulzzyInstallScreen";


        screen.innerHTML = `

            <div class="kulzzyInstallBox">

                <div class="kulzzyInstallImageWrap">

                    <img
                        src="./logo.jpg"
                        class="kulzzyInstallImage"
                        alt="Kulzzy Radio"
                    >

                </div>


                <div class="kulzzyInstallTitle">
                    INSTALL KULZZY RADIO
                </div>


                <div class="kulzzyInstallLive">
                    🔴 JOIN US LIVE ON-AIR
                </div>


                <div
                    id="kulzzyInstallMessage"
                    class="kulzzyInstallMessage"
                >
                    Install Kulzzy Radio on your device for quick and easy access.
                </div>


                <button
                    id="kulzzyInstallButton"
                    class="kulzzyInstallButton"
                    type="button"
                >
                    📲 INSTALL APP
                </button>


                <button
                    id="kulzzyContinueButton"
                    class="kulzzyContinueButton"
                    type="button"
                >
                    CONTINUE TO KULZZY RADIO
                </button>


                <div
                    id="kulzzyInstallHelp"
                    class="kulzzyInstallHelp"
                ></div>

            </div>

        `;


        document.body.appendChild(screen);


        addInstallStyles();


        setupInstallButton();


        setupContinueButton();


        updateInstallScreen();

    }


    /* =====================================================
       INSTALL BUTTON
    ===================================================== */

    function setupInstallButton() {

        var button =
            document.getElementById(
                "kulzzyInstallButton"
            );


        if (!button) {

            return;

        }


        button.addEventListener(
            "click",
            async function () {


                /* -----------------------------------------
                   NATIVE PWA INSTALL PROMPT
                ----------------------------------------- */

                if (deferredInstallPrompt) {

                    try {

                        deferredInstallPrompt.prompt();


                        var result =
                            await deferredInstallPrompt.userChoice;


                        if (
                            result &&
                            result.outcome ===
                            "accepted"
                        ) {

                            rememberInstallation();

                        }

                    }

                    catch (error) {

                        console.log(
                            "Kulzzy install error:",
                            error
                        );

                    }


                    deferredInstallPrompt =
                        null;

                    window.kulzzyInstallPrompt =
                        null;

                    return;

                }


                /* -----------------------------------------
                   IOS
                ----------------------------------------- */

                if (isIOS()) {

                    showIOSInstructions();

                    return;

                }


                /* -----------------------------------------
                   ANDROID
                ----------------------------------------- */

                if (isAndroid()) {

                    showAndroidInstructions();

                    return;

                }


                /* -----------------------------------------
                   DESKTOP
                ----------------------------------------- */

                showDesktopInstructions();

            },
            false
        );

    }


    /* =====================================================
       CONTINUE BUTTON
    ===================================================== */

    function setupContinueButton() {

        var button =
            document.getElementById(
                "kulzzyContinueButton"
            );


        if (!button) {

            return;

        }


        button.addEventListener(
            "click",
            function () {

                closeInstallScreen();

            },
            false
        );

    }


    /* =====================================================
       UPDATE INSTALL SCREEN
    ===================================================== */

    function updateInstallScreen() {

        var message =
            document.getElementById(
                "kulzzyInstallMessage"
            );


        var help =
            document.getElementById(
                "kulzzyInstallHelp"
            );


        if (!message || !help) {

            return;

        }


        if (deferredInstallPrompt) {

            message.innerHTML =
                "Install Kulzzy Radio on your device for quick and easy access.";

            help.innerHTML = "";

            return;

        }


        if (isIOSSafari()) {

            message.innerHTML =
                "Install Kulzzy Radio directly from Safari.";

            help.innerHTML =
                "Tap the Share button and choose <b>Add to Home Screen</b>.";

            return;

        }


        if (isIOS()) {

            message.innerHTML =
                "Install Kulzzy Radio from your browser's Share menu.";

            help.innerHTML =
                "Tap <b>Share</b> and choose <b>Add to Home Screen</b>.";

            return;

        }


        if (isAndroid()) {

            message.innerHTML =
                "Your browser may show the installation option in its menu.";

            help.innerHTML =
                "Open your browser menu ⋮ and choose <b>Install app</b> or <b>Add to Home screen</b>.";

            return;

        }


        message.innerHTML =
            "Install Kulzzy Radio as an app from your browser.";

        help.innerHTML =
            "Open your browser menu and choose <b>Install</b> or <b>Install Kulzzy Radio</b>.";

    }


    /* =====================================================
       ANDROID INSTRUCTIONS
    ===================================================== */

    function showAndroidInstructions() {

        var message =
            document.getElementById(
                "kulzzyInstallMessage"
            );


        var help =
            document.getElementById(
                "kulzzyInstallHelp"
            );


        if (!message || !help) {

            return;

        }


        message.innerHTML =
            "Your browser has not provided the automatic installation button yet.";


        help.innerHTML = `

            <b>ANDROID INSTALL</b><br><br>

            1. Open the browser menu ⋮<br>

            2. Look for <b>Install app</b><br>

            3. If you don't see that, choose
               <b>Add to Home screen</b><br>

            4. Follow the installation message.

        `;

    }


    /* =====================================================
       IOS INSTRUCTIONS
    ===================================================== */

    function showIOSInstructions() {

        var message =
            document.getElementById(
                "kulzzyInstallMessage"
            );


        var help =
            document.getElementById(
                "kulzzyInstallHelp"
            );


        if (!message || !help) {

            return;

        }


        message.innerHTML =
            "Install Kulzzy Radio from the Share menu.";


        help.innerHTML = `

            <b>IPHONE / IPAD</b><br><br>

            1. Tap the <b>Share</b> button<br>

            2. Scroll down<br>

            3. Tap <b>Add to Home Screen</b><br>

            4. Tap <b>Add</b>

        `;

    }


    /* =====================================================
       DESKTOP INSTRUCTIONS
    ===================================================== */

    function showDesktopInstructions() {

        var message =
            document.getElementById(
                "kulzzyInstallMessage"
            );


        var help =
            document.getElementById(
                "kulzzyInstallHelp"
            );


        if (!message || !help) {

            return;

        }


        message.innerHTML =
            "Install Kulzzy Radio directly from your browser.";


        help.innerHTML = `

            <b>COMPUTER INSTALL</b><br><br>

            Open the browser menu and choose
            <b>Install Kulzzy Radio</b> or
            <b>Install</b>.

        `;

    }


    /* =====================================================
       CLOSE
    ===================================================== */

    function closeInstallScreen() {

        var screen =
            document.getElementById(
                "kulzzyInstallScreen"
            );


        if (screen) {

            screen.remove();

        }

    }


    /* =====================================================
       STYLES
    ===================================================== */

    function addInstallStyles() {

        if (
            document.getElementById(
                "kulzzyInstallStyles"
            )
        ) {

            return;

        }


        var style =
            document.createElement("style");


        style.id =
            "kulzzyInstallStyles";


        style.textContent = `

            #kulzzyInstallScreen{

                position:fixed;

                inset:0;

                width:100%;

                height:100%;

                z-index:2147483647;

                background:rgba(2,13,26,.96);

                display:flex;

                align-items:center;

                justify-content:center;

                padding:20px;

                overflow:auto;

            }


            .kulzzyInstallBox{

                width:100%;

                max-width:430px;

                background:#06152B;

                border-radius:20px;

                padding:24px;

                text-align:center;

                box-shadow:
                    0 20px 60px
                    rgba(0,0,0,.55);

                border:1px solid
                    rgba(255,255,255,.12);

            }


            .kulzzyInstallImageWrap{

                width:100%;

                display:flex;

                justify-content:center;

                margin-bottom:18px;

            }


            .kulzzyInstallImage{

                width:150px;

                height:150px;

                object-fit:cover;

                border-radius:18px;

                display:block;

            }


            .kulzzyInstallTitle{

                color:#FFD700;

                font-size:27px;

                font-weight:900;

                line-height:1.15;

                margin-bottom:8px;

            }


            .kulzzyInstallLive{

                color:#ffffff;

                font-size:17px;

                font-weight:800;

                margin-bottom:18px;

            }


            .kulzzyInstallMessage{

                color:#ffffff;

                font-size:15px;

                line-height:1.5;

                margin-bottom:14px;

            }


            .kulzzyInstallButton{

                width:100%;

                border:0;

                border-radius:12px;

                padding:15px;

                margin-top:8px;

                background:#FFD700;

                color:#06152B;

                font-size:17px;

                font-weight:900;

                cursor:pointer;

            }


            .kulzzyContinueButton{

                width:100%;

                border:1px solid
                    rgba(255,255,255,.25);

                border-radius:12px;

                padding:14px;

                margin-top:10px;

                background:transparent;

                color:#ffffff;

                font-size:15px;

                font-weight:800;

                cursor:pointer;

            }


            .kulzzyInstallHelp{

                color:#ffffff;

                font-size:14px;

                line-height:1.55;

                margin-top:16px;

            }


            @media(max-width:480px){

                .kulzzyInstallBox{

                    padding:20px;

                }


                .kulzzyInstallImage{

                    width:125px;

                    height:125px;

                }


                .kulzzyInstallTitle{

                    font-size:23px;

                }

            }

        `;


        document.head.appendChild(style);

    }


    /* =====================================================
       APP INSTALLED
    ===================================================== */

    window.addEventListener(
        "appinstalled",
        function () {

            deferredInstallPrompt =
                null;


            window.kulzzyInstallPrompt =
                null;


            rememberInstallation();

        },
        false
    );


    /* =====================================================
       WAIT FOR PAGE
    ===================================================== */

    function startInstallSystem() {

        if (isInstalled()) {

            removeInstallScreens();

            return;

        }


        createInstallScreen();

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            startInstallSystem
        );

    }
    else {

        startInstallSystem();

    }


})();
