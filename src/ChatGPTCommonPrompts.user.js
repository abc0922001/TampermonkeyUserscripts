// ==UserScript==
// @name         ChatGPT: 在回應結果的地方加入常見提示回應按鈕
// @version      1.1.3
// @description  點擊按鈕就會自動填入 ChatGPT 提示文字輸入框並自動送出提問
// @license      MIT
// @homepage     https://blog.miniasp.com/
// @homepageURL  https://blog.miniasp.com/
// @website      https://www.facebook.com/will.fans
// @source       https://github.com/abc0922001/TampermonkeyUserscripts/raw/main/src/ChatGPTCommonPrompts.user.js
// @namespace    https://github.com/abc0922001/TampermonkeyUserscripts/raw/main/src/ChatGPTCommonPrompts.user.js
// @match        *://chatgpt.com/*
// @author       Will Huang,abc0922001
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// ==/UserScript==

/*

# Credit

- 此腳本源自於 Mike Huang 的想法與實作，並在不斷的互動之中不斷精鍊，特此感謝他的想法。

# 使用方法

1. 先進行提問
2. 提問結果會出現幾個好用的「常見回應」按鈕，按下按鈕就會自動幫你進行提問

*/

(function () {
    "use strict";

    const defaultManualSubmitText = [
        { text: "舉例說明", value: "請舉例說明" },
        { text: "提供細節", value: "請提供更多細節說明" },
        {
            text: "翻譯成繁中",
            value: "請將上述回應內容翻譯成臺灣常用的正體中文。",
        },
        {
            text: "翻譯成英文",
            value: "Please translate the above response into English.",
        },
    ];

    let lastBlock = null;

    function addButtons(talkBlock) {
        // create a new buttons area
        const buttonsArea = document.createElement("div");
        buttonsArea.classList =
            "custom-buttons-area text-base m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0";
        buttonsArea.style.overflowY = "auto";
        buttonsArea.style.display = "flex";
        buttonsArea.style.flexWrap = "wrap";
        buttonsArea.style.paddingTop = "0.75rem";
        buttonsArea.style.paddingLeft = "calc(30px + 0.75rem)";
        buttonsArea.id = "custom-chatgpt-magic-box-buttons";

        defaultManualSubmitText.forEach((item) => {
            const button = document.createElement("button");
            button.style.border = "1px solid #d1d5db";
            button.style.borderRadius = "5px";
            button.style.padding = "0.5rem 1rem";
            button.style.margin = "0.5rem";

            button.innerText = item.text;
            button.addEventListener("click", () => {
                const textarea = document.getElementById("prompt-textarea");
                if (textarea) {
                    textarea.value = item.value;
                    textarea.dispatchEvent(
                        new Event("input", { bubbles: true })
                    );
                    textarea.focus();
                    textarea.setSelectionRange(
                        textarea.value.length,
                        textarea.value.length
                    );
                    textarea.scrollTop = textarea.scrollHeight;

                    const sendButton = document.querySelector(
                        'button[data-testid="send-button"]'
                    );
                    if (sendButton) {
                        sendButton.click();
                    }
                }
            });

            buttonsArea.append(button);
        });

        talkBlock.appendChild(buttonsArea);
    }

    const observer = new MutationObserver(() => {
        const talkBlocks = document.querySelectorAll(
            'div[data-testid^="conversation-turn-"]'
        );
        if (!talkBlocks || !talkBlocks.length) {
            return;
        }

        const currentBlock = talkBlocks[talkBlocks.length - 1];
        if (currentBlock !== lastBlock) {
            const buttonsArea = document.getElementById(
                "custom-chatgpt-magic-box-buttons"
            );
            if (buttonsArea) {
                buttonsArea.remove();
            }

            addButtons(currentBlock);
            lastBlock = currentBlock;
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // 初始化觀察，監控回應區域
    const checkForTextareaInput = setInterval(() => {
        const textarea = document.getElementById("prompt-textarea");
        const sendButton = document.querySelector(
            'button[data-testid="send-button"]'
        );
        if (textarea && sendButton) {
            observer.observe(document.body, { childList: true, subtree: true });
            clearInterval(checkForTextareaInput);
        }
    }, 60);
})();
