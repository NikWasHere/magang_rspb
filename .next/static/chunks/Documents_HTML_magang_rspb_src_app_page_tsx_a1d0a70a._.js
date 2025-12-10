(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Documents/HTML/magang_rspb/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HTML/magang_rspb/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HTML/magang_rspb/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HTML/magang_rspb/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documents/HTML/magang_rspb/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const images = [
    {
        src: "/Lobby.jpg",
        alt: "Lobby Rumah Sakit - Ruang tunggu yang nyaman dan modern"
    },
    {
        src: "/Lobby2.jpg",
        alt: "Fasilitas Medis Modern - Peralatan medis terkini"
    },
    {
        src: "/Lobby3.jpg",
        alt: "Pelayanan Kesehatan Terpercaya - Tim medis profesional"
    }
];
function HomePage() {
    _s();
    const [currentImageIndex, setCurrentImageIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    // Auto-change image every 5 seconds
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomePage.useEffect": ()=>{
            const interval = setInterval({
                "HomePage.useEffect.interval": ()=>{
                    setCurrentImageIndex({
                        "HomePage.useEffect.interval": (prevIndex)=>prevIndex === images.length - 1 ? 0 : prevIndex + 1
                    }["HomePage.useEffect.interval"]);
                }
            }["HomePage.useEffect.interval"], 5000) // 5000ms = 5 detik
            ;
            return ({
                "HomePage.useEffect": ()=>clearInterval(interval) // Cleanup interval on component unmount
            })["HomePage.useEffect"];
        }
    }["HomePage.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-gray-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "mx-auto grid max-w-6xl gap-8 px-4 pb-24 pt-16 md:grid-cols-2 md:items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-pretty text-4xl font-bold leading-tight md:text-5xl",
                                children: "Ayo lakukan pendaftran online"
                            }, void 0, false, {
                                fileName: "[project]/Documents/HTML/magang_rspb/src/app/page.tsx",
                                lineNumber: 41,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-4 text-muted-foreground",
                                children: "Cukup dengan klik ini"
                            }, void 0, false, {
                                fileName: "[project]/Documents/HTML/magang_rspb/src/app/page.tsx",
                                lineNumber: 42,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-6 flex gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/daftar",
                                        className: "inline-flex h-11 items-center rounded-md bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90",
                                        children: "Daftar Sekarang"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HTML/magang_rspb/src/app/page.tsx",
                                        lineNumber: 44,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/accounts",
                                        className: "inline-flex h-11 items-center rounded-md border border-input bg-background px-6 font-medium hover:bg-accent hover:text-accent-foreground",
                                        children: "Demo Accounts"
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HTML/magang_rspb/src/app/page.tsx",
                                        lineNumber: 50,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Documents/HTML/magang_rspb/src/app/page.tsx",
                                lineNumber: 43,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documents/HTML/magang_rspb/src/app/page.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid place-items-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative w-full max-w-[480px] h-[360px] overflow-hidden rounded-lg shadow-lg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    src: images[currentImageIndex].src,
                                    alt: images[currentImageIndex].alt,
                                    width: 480,
                                    height: 360,
                                    className: "h-full w-full object-cover transition-opacity duration-500",
                                    priority: true
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HTML/magang_rspb/src/app/page.tsx",
                                    lineNumber: 61,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2",
                                    children: images.map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setCurrentImageIndex(index),
                                            className: "w-3 h-3 rounded-full transition-colors duration-300 ".concat(index === currentImageIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'),
                                            "aria-label": "Go to image ".concat(index + 1)
                                        }, index, false, {
                                            fileName: "[project]/Documents/HTML/magang_rspb/src/app/page.tsx",
                                            lineNumber: 73,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HTML/magang_rspb/src/app/page.tsx",
                                    lineNumber: 71,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setCurrentImageIndex(currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1),
                                    className: "absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors duration-300",
                                    "aria-label": "Previous image",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-5 h-5",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M15 19l-7-7 7-7"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HTML/magang_rspb/src/app/page.tsx",
                                            lineNumber: 95,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HTML/magang_rspb/src/app/page.tsx",
                                        lineNumber: 94,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HTML/magang_rspb/src/app/page.tsx",
                                    lineNumber: 87,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setCurrentImageIndex(currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1),
                                    className: "absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors duration-300",
                                    "aria-label": "Next image",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-5 h-5",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M9 5l7 7-7 7"
                                        }, void 0, false, {
                                            fileName: "[project]/Documents/HTML/magang_rspb/src/app/page.tsx",
                                            lineNumber: 107,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Documents/HTML/magang_rspb/src/app/page.tsx",
                                        lineNumber: 106,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Documents/HTML/magang_rspb/src/app/page.tsx",
                                    lineNumber: 99,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Documents/HTML/magang_rspb/src/app/page.tsx",
                            lineNumber: 60,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Documents/HTML/magang_rspb/src/app/page.tsx",
                        lineNumber: 59,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/HTML/magang_rspb/src/app/page.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: "/images/ref-hero.png",
                        alt: "reference hero"
                    }, void 0, false, {
                        fileName: "[project]/Documents/HTML/magang_rspb/src/app/page.tsx",
                        lineNumber: 116,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: "/images/ref-register.png",
                        alt: "reference register"
                    }, void 0, false, {
                        fileName: "[project]/Documents/HTML/magang_rspb/src/app/page.tsx",
                        lineNumber: 117,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: "/images/ref-register-success.png",
                        alt: "reference register success"
                    }, void 0, false, {
                        fileName: "[project]/Documents/HTML/magang_rspb/src/app/page.tsx",
                        lineNumber: 118,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: "/images/ref-dashboard.png",
                        alt: "reference dashboard"
                    }, void 0, false, {
                        fileName: "[project]/Documents/HTML/magang_rspb/src/app/page.tsx",
                        lineNumber: 119,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documents$2f$HTML$2f$magang_rspb$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: "/images/ref-login-required.png",
                        alt: "reference login required"
                    }, void 0, false, {
                        fileName: "[project]/Documents/HTML/magang_rspb/src/app/page.tsx",
                        lineNumber: 120,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documents/HTML/magang_rspb/src/app/page.tsx",
                lineNumber: 115,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documents/HTML/magang_rspb/src/app/page.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
_s(HomePage, "iwdYV/csWqs0gMEM0R8yiwCHnVs=");
_c = HomePage;
var _c;
__turbopack_context__.k.register(_c, "HomePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Documents_HTML_magang_rspb_src_app_page_tsx_a1d0a70a._.js.map