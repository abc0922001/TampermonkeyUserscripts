// ==UserScript==
// @name         ChatGPT: 滑鼠雙擊編輯提示文字
// @version      1.0.3
// @description  滑鼠雙擊先前已經輸入的提示就可直接編輯
// @license      MIT
// @homepage     https://blog.miniasp.com/
// @homepageURL  https://blog.miniasp.com/
// @website      https://www.facebook.com/will.fans
// @source       https://github.com/abc0922001/TampermonkeyUserscripts/raw/main/src/ChatGPTDoubleClickEdit.user.js
// @namespace    https://github.com/abc0922001/TampermonkeyUserscripts/raw/main/src/ChatGPTDoubleClickEdit.user.js
// @match        *://chatgpt.com/*
// @run-at       document-idle
// @author       Will Huang,abc0922001
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// ==/UserScript==

(async function () {
    "use strict";

    function initListener() {
        document.body.addEventListener("dblclick", (event) => {
            let target = event.target;

            // 確保 target 是一個元素節點
            while (target && target.nodeType !== Node.ELEMENT_NODE) {
                target = target.parentElement;
            }

            if (target) {
                // 尋找最近包含 svg 鉛筆圖示的按鈕
                const container = target.closest(".relative");
                if (container) {
                    const svgPath =
                        "path[fill-rule='evenodd'][d='M13.293 4.293a4.536 4.536 0 1 1 6.414 6.414l-1 1-7.094 7.094A5 5 0 0 1 8.9 20.197l-4.736.79a1 1 0 0 1-1.15-1.151l.789-4.736a5 5 0 0 1 1.396-2.713zM13 7.414l-6.386 6.387a3 3 0 0 0-.838 1.628l-.56 3.355 3.355-.56a3 3 0 0 0 1.628-.837L16.586 11zm5 2.172L14.414 6l.293-.293a2.536 2.536 0 0 1 3.586 3.586z'][clip-rule='evenodd']";
                    const svg = container.querySelector(svgPath);
                    if (svg) {
                        const btn = svg.closest("button");
                        if (btn) {
                            btn.click();
                        }
                    }
                }
            }
        });
        console.log("ChatGPT: 滑鼠雙擊編輯提示文字 Initialized");
    }

    const observer = new MutationObserver((mutations, obs) => {
        if (document.getElementsByTagName("main").length > 0) {
            initListener();
            obs.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();
