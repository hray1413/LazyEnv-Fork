/*
 * LazyEnv - Cross-platform, recoverable, zero-pollution dev environment configurator
 * Copyright (C) 2026 Rein
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

// ============================================================================
// LazyEnv - i18n.js
// Internationalization module with locale dictionaries and translation API.
// Supports: en, zh-CN
// ============================================================================

(function () {
    "use strict";

    // -----------------------------------------------------------------------
    // Language packs
    // -----------------------------------------------------------------------
    var locales = {

        // ===================================================================
        // English
        // ===================================================================
        "en": {
            // Titlebar
            "titlebar.label":               "LazyEnv",
            "btn.minimize":                 "Minimize",
            "btn.maximize":                 "Maximize",
            "btn.close":                    "Close",

            // Sidebar
            "sidebar.overview":             "Overview",
            "sidebar.home":                 "Home",
            "sidebar.setup":                "Setup",
            "sidebar.systemCheck":          "System Check",
            "sidebar.packages":             "Packages",
            "sidebar.install":              "Install",
            "sidebar.manage":               "Manage",
            "sidebar.recovery":             "Recovery",
            "sidebar.summary":              "Summary",

            // Home
            "home.title":                   "Installed Environments",
            "home.desc":                    "Detected development tools and runtimes on this system.",
            "home.searchPlaceholder":       "Search environments...",
            "home.btnAdd":                  "Add",
            "home.btnRefresh":              "Refresh",
            "home.addPanel.title":          "Add Development Environment",
            "home.addPanel.desc":           "Enter a command name to detect. LazyEnv will attempt to identify the tool and its version.",
            "home.addPanel.commandLabel":   "Command",
            "home.addPanel.commandPlaceholder": "e.g. python, node, rustc, gcc",
            "home.addPanel.categoryLabel":  "Category",
            "home.addPanel.btnDetect":      "Detect",

            // Categories
            "category.language":            "Language / Runtime",
            "category.tool":                "Build Tool",
            "category.runtime":             "Container / VM",
            "category.utility":             "Utility",
            "category.editor":              "Editor / IDE",
            "category.database":            "Database",
            "category.other":               "Other",

            // System Check
            "check.title":                  "System Check",
            "check.desc":                   "Verifying system requirements before setup.",
            "check.infoBox":                "LazyEnv creates an automatic snapshot of your environment variables before making any changes. You can restore at any time from the Recovery page.",
            "check.os":                     "Operating System",
            "check.webview2":               "WebView2 Runtime",
            "check.winget":                 "winget Package Manager",
            "check.detecting":              "Detecting...",
            "check.available":              "Available",
            "check.checking":               "Checking...",
            "check.notFound":               "Not found",

            // Packages
            "packages.title":               "Select Packages",
            "packages.desc":                "Choose development tools to install. PATH will be configured automatically.",
            "packages.searchPlaceholder":   "Search packages...",
            "packages.btnInstall":          "Install Selected ({0})",

            // Install
            "install.title":                "Installation",
            "install.desc":                 "Installing packages via winget with real-time progress.",
            "install.progressText":         "{0} / {1} packages",
            "install.emptyState":           "Select packages and start installation from the Packages page.",
            "install.pending":              "Pending",
            "install.installing":           "Installing...",
            "install.installed":            "Installed",
            "install.failed":               "Failed (exit {0})",
            "install.skipped":              "Already installed",
            "install.waitingOutput":        "Waiting for output...",
            "install.noPackages":           "No packages queued.",
            "install.btnRetry":             "Retry",
            "install.retrying":             "Retrying...",
            "install.waiting":              "Waiting...",

            // Recovery
            "recovery.title":               "Recovery & Snapshots",
            "recovery.desc":                "Manage environment variable snapshots. Restore to any previous state.",
            "recovery.btnCreate":           "Create Snapshot",
            "recovery.btnRefresh":          "Refresh",
            "recovery.emptyState":          "No snapshots yet. Create one to get started.",
            "recovery.userCount":           "User: {0}",
            "recovery.systemCount":         "System: {0}",
            "recovery.btnRestore":          "Restore",
            "recovery.btnDelete":           "Delete",
            "recovery.confirmRestore":      "Restore environment from this snapshot?",
            "recovery.confirmDelete":       "Delete this snapshot?",
            "recovery.restoreSuccess":      "Environment restored successfully.",
            "recovery.restoreFailed":       "Restore failed. Check admin permissions.",
            "recovery.snapshotCreated":     "Snapshot created: {0}",
            "recovery.promptDesc":          "Snapshot description (optional):",
            "recovery.defaultDesc":         "Manual snapshot",
            "recovery.btnImport":           "Import",
            "recovery.btnExport":           "Export",
            "recovery.exportSuccess":       "Snapshot exported successfully.",
            "recovery.exportFailed":        "Failed to export snapshot.",
            "recovery.importSuccess":       "Snapshot imported successfully.",
            "recovery.importFailed":        "Failed to import snapshot. Check file format.",

            // Summary
            "summary.title":                "Summary",
            "summary.desc":                 "Overview of all changes made during this session.",
            "summary.infoBox":              "All operations completed. A snapshot was created before installation.",
            "summary.colPackage":           "Package",
            "summary.colStatus":            "Status",
            "summary.colCommand":           "Command",
            "summary.colDetails":           "Details",
            "summary.emptyState":           "No installation data yet.",
            "summary.success":              "Success",
            "summary.failed":               "Failed",
            "summary.skipped":              "Skipped",

            // Environment cards
            "env.scanning":                 "Scanning system...",
            "env.noMatch":                  "No matching environments found.",
            "env.btnUninstall":             "Uninstall",
            "env.confirmUninstall":         "Uninstall {0} via winget?",
            "env.uninstallSuccess":         "Uninstalled: {0}",
            "env.uninstallFailed":          "Uninstall failed.",

            // Probe
            "probe.detecting":              "Detecting...",
            "probe.found":                  "Found: {0}",
            "probe.notFound":               "Not found.",
            "probe.addedToast":             "Added: {0} ({1})",

            // Language switcher
            "lang.label":                   "Language"
        },

        // ===================================================================
        // Simplified Chinese
        // ===================================================================
        "zh-CN": {
            // Titlebar
            "titlebar.label":               "LazyEnv",
            "btn.minimize":                 "\u6700\u5c0f\u5316",
            "btn.maximize":                 "\u6700\u5927\u5316",
            "btn.close":                    "\u5173\u95ed",

            // Sidebar
            "sidebar.overview":             "\u6982\u89c8",
            "sidebar.home":                 "\u4e3b\u9875",
            "sidebar.setup":                "\u914d\u7f6e",
            "sidebar.systemCheck":          "\u7cfb\u7edf\u68c0\u67e5",
            "sidebar.packages":             "\u8f6f\u4ef6\u5305",
            "sidebar.install":              "\u5b89\u88c5",
            "sidebar.manage":               "\u7ba1\u7406",
            "sidebar.recovery":             "\u6062\u590d",
            "sidebar.summary":              "\u6458\u8981",

            // Home
            "home.title":                   "\u5df2\u5b89\u88c5\u7684\u5f00\u53d1\u73af\u5883",
            "home.desc":                    "\u68c0\u6d4b\u5230\u7684\u672c\u673a\u5f00\u53d1\u5de5\u5177\u548c\u8fd0\u884c\u65f6\u73af\u5883\u3002",
            "home.searchPlaceholder":       "\u641c\u7d22\u73af\u5883...",
            "home.btnAdd":                  "\u6dfb\u52a0",
            "home.btnRefresh":              "\u5237\u65b0",
            "home.addPanel.title":          "\u6dfb\u52a0\u5f00\u53d1\u73af\u5883",
            "home.addPanel.desc":           "\u8f93\u5165\u547d\u4ee4\u540d\u79f0\u8fdb\u884c\u68c0\u6d4b\u3002LazyEnv \u5c06\u5c1d\u8bd5\u8bc6\u522b\u8be5\u5de5\u5177\u53ca\u5176\u7248\u672c\u3002",
            "home.addPanel.commandLabel":   "\u547d\u4ee4",
            "home.addPanel.commandPlaceholder": "\u4f8b\u5982 python, node, rustc, gcc",
            "home.addPanel.categoryLabel":  "\u5206\u7c7b",
            "home.addPanel.btnDetect":      "\u68c0\u6d4b",

            // Categories
            "category.language":            "\u8bed\u8a00 / \u8fd0\u884c\u65f6",
            "category.tool":                "\u6784\u5efa\u5de5\u5177",
            "category.runtime":             "\u5bb9\u5668 / \u865a\u62df\u673a",
            "category.utility":             "\u5b9e\u7528\u5de5\u5177",
            "category.editor":              "\u7f16\u8f91\u5668 / IDE",
            "category.database":            "\u6570\u636e\u5e93",
            "category.other":               "\u5176\u4ed6",

            // System Check
            "check.title":                  "\u7cfb\u7edf\u68c0\u67e5",
            "check.desc":                   "\u5728\u914d\u7f6e\u524d\u9a8c\u8bc1\u7cfb\u7edf\u8981\u6c42\u3002",
            "check.infoBox":                "LazyEnv \u4f1a\u5728\u4efb\u4f55\u66f4\u6539\u4e4b\u524d\u81ea\u52a8\u521b\u5efa\u73af\u5883\u53d8\u91cf\u5feb\u7167\u3002\u60a8\u53ef\u4ee5\u968f\u65f6\u901a\u8fc7\u201c\u6062\u590d\u201d\u9875\u9762\u8fd8\u539f\u3002",
            "check.os":                     "\u64cd\u4f5c\u7cfb\u7edf",
            "check.webview2":               "WebView2 \u8fd0\u884c\u65f6",
            "check.winget":                 "winget \u5305\u7ba1\u7406\u5668",
            "check.detecting":              "\u68c0\u6d4b\u4e2d...",
            "check.available":              "\u53ef\u7528",
            "check.checking":               "\u68c0\u67e5\u4e2d...",
            "check.notFound":               "\u672a\u627e\u5230",

            // Packages
            "packages.title":               "\u9009\u62e9\u8f6f\u4ef6\u5305",
            "packages.desc":                "\u9009\u62e9\u8981\u5b89\u88c5\u7684\u5f00\u53d1\u5de5\u5177\u3002PATH \u5c06\u81ea\u52a8\u914d\u7f6e\u3002",
            "packages.searchPlaceholder":   "\u641c\u7d22\u8f6f\u4ef6\u5305...",
            "packages.btnInstall":          "\u5b89\u88c5\u5df2\u9009 ({0})",

            // Install
            "install.title":                "\u5b89\u88c5",
            "install.desc":                 "\u901a\u8fc7 winget \u5b89\u88c5\u8f6f\u4ef6\u5305\uff0c\u5b9e\u65f6\u663e\u793a\u8fdb\u5ea6\u3002",
            "install.progressText":         "{0} / {1} \u4e2a\u8f6f\u4ef6\u5305",
            "install.emptyState":           "\u8bf7\u5148\u5728\u201c\u8f6f\u4ef6\u5305\u201d\u9875\u9762\u9009\u62e9\u5e76\u5f00\u59cb\u5b89\u88c5\u3002",
            "install.pending":              "\u7b49\u5f85\u4e2d",
            "install.installing":           "\u5b89\u88c5\u4e2d...",
            "install.installed":            "\u5df2\u5b89\u88c5",
            "install.failed":               "\u5931\u8d25 (\u9000\u51fa\u7801 {0})",
            "install.skipped":              "\u5df2\u5b58\u5728",
            "install.waitingOutput":        "\u7b49\u5f85\u8f93\u51fa...",
            "install.noPackages":           "\u6ca1\u6709\u6392\u961f\u7684\u8f6f\u4ef6\u5305\u3002",
            "install.btnRetry":             "\u91cd\u8bd5",
            "install.retrying":             "\u91cd\u8bd5\u4e2d...",
            "install.waiting":              "\u7b49\u5f85\u4e2d...",

            // Recovery
            "recovery.title":               "\u6062\u590d\u4e0e\u5feb\u7167",
            "recovery.desc":                "\u7ba1\u7406\u73af\u5883\u53d8\u91cf\u5feb\u7167\u3002\u53ef\u6062\u590d\u5230\u4efb\u610f\u5386\u53f2\u72b6\u6001\u3002",
            "recovery.btnCreate":           "\u521b\u5efa\u5feb\u7167",
            "recovery.btnRefresh":          "\u5237\u65b0",
            "recovery.emptyState":          "\u6682\u65e0\u5feb\u7167\u3002\u521b\u5efa\u4e00\u4e2a\u4ee5\u5f00\u59cb\u4f7f\u7528\u3002",
            "recovery.userCount":           "\u7528\u6237\u53d8\u91cf: {0}",
            "recovery.systemCount":         "\u7cfb\u7edf\u53d8\u91cf: {0}",
            "recovery.btnRestore":          "\u6062\u590d",
            "recovery.btnDelete":           "\u5220\u9664",
            "recovery.confirmRestore":      "\u786e\u5b9a\u8981\u4ece\u6b64\u5feb\u7167\u6062\u590d\u73af\u5883\u5417\uff1f",
            "recovery.confirmDelete":       "\u786e\u5b9a\u8981\u5220\u9664\u6b64\u5feb\u7167\u5417\uff1f",
            "recovery.restoreSuccess":      "\u73af\u5883\u5df2\u6210\u529f\u6062\u590d\u3002",
            "recovery.restoreFailed":       "\u6062\u590d\u5931\u8d25\u3002\u8bf7\u68c0\u67e5\u7ba1\u7406\u5458\u6743\u9650\u3002",
            "recovery.snapshotCreated":     "\u5feb\u7167\u5df2\u521b\u5efa: {0}",
            "recovery.promptDesc":          "\u5feb\u7167\u63cf\u8ff0\uff08\u53ef\u9009\uff09:",
            "recovery.defaultDesc":         "\u624b\u52a8\u5feb\u7167",
            "recovery.btnImport":           "\u5bfc\u5165",
            "recovery.btnExport":           "\u5bfc\u51fa",
            "recovery.exportSuccess":       "\u5feb\u7167\u5df2\u6210\u529f\u5bfc\u51fa\u3002",
            "recovery.exportFailed":        "\u5bfc\u51fa\u5feb\u7167\u5931\u8d25\u3002",
            "recovery.importSuccess":       "\u5feb\u7167\u5df2\u6210\u529f\u5bfc\u5165\u3002",
            "recovery.importFailed":        "\u5bfc\u5165\u5feb\u7167\u5931\u8d25\u3002\u8bf7\u68c0\u67e5\u6587\u4ef6\u683c\u5f0f\u3002",

            // Summary
            "summary.title":                "\u6458\u8981",
            "summary.desc":                 "\u672c\u6b21\u4f1a\u8bdd\u6240\u6709\u66f4\u6539\u7684\u6982\u89c8\u3002",
            "summary.infoBox":              "\u6240\u6709\u64cd\u4f5c\u5df2\u5b8c\u6210\u3002\u5b89\u88c5\u524d\u5df2\u521b\u5efa\u5feb\u7167\u3002",
            "summary.colPackage":           "\u8f6f\u4ef6\u5305",
            "summary.colStatus":            "\u72b6\u6001",
            "summary.colCommand":           "\u547d\u4ee4",
            "summary.colDetails":           "\u8be6\u60c5",
            "summary.emptyState":           "\u6682\u65e0\u5b89\u88c5\u6570\u636e\u3002",
            "summary.success":              "\u6210\u529f",
            "summary.failed":               "\u5931\u8d25",
            "summary.skipped":              "\u5df2\u8df3\u8fc7",

            // Environment cards
            "env.scanning":                 "\u6b63\u5728\u626b\u63cf\u7cfb\u7edf...",
            "env.noMatch":                  "\u672a\u627e\u5230\u5339\u914d\u7684\u73af\u5883\u3002",
            "env.btnUninstall":             "\u5378\u8f7d",
            "env.confirmUninstall":         "\u786e\u5b9a\u8981\u901a\u8fc7 winget \u5378\u8f7d {0} \u5417\uff1f",
            "env.uninstallSuccess":         "\u5df2\u5378\u8f7d: {0}",
            "env.uninstallFailed":          "\u5378\u8f7d\u5931\u8d25\u3002",

            // Probe
            "probe.detecting":              "\u68c0\u6d4b\u4e2d...",
            "probe.found":                  "\u5df2\u627e\u5230: {0}",
            "probe.notFound":               "\u672a\u627e\u5230\u3002",
            "probe.addedToast":             "\u5df2\u6dfb\u52a0: {0} ({1})",

            // Language switcher
            "lang.label":                   "\u8bed\u8a00"
        }
    };

    // -----------------------------------------------------------------------
    // State
    // -----------------------------------------------------------------------
    var currentLocale = "en";

    // Detect system language
    (function detectLocale() {
        var lang = navigator.language || navigator.userLanguage || "en";
        if (lang.toLowerCase().startsWith("zh")) {
            currentLocale = "zh-CN";
        } else {
            currentLocale = "en";
        }
        // Check localStorage override
        var saved = localStorage.getItem("lazyenv_locale");
        if (saved && locales[saved]) {
            currentLocale = saved;
        }
    })();

    // -----------------------------------------------------------------------
    // Translation function
    // t(key)            -> returns translated string
    // t(key, arg1, ...) -> replaces {0}, {1}, ... with arguments
    // -----------------------------------------------------------------------
    function t(key) {
        var dict = locales[currentLocale] || locales["en"];
        var str = dict[key];
        if (str === undefined) {
            // Fallback to English
            str = locales["en"][key];
        }
        if (str === undefined) {
            // Return key itself as last resort
            return key;
        }
        // Replace placeholders {0}, {1}, ...
        if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
                str = str.replace("{" + (i - 1) + "}", arguments[i]);
            }
        }
        return str;
    }

    // -----------------------------------------------------------------------
    // Apply translations to static HTML elements
    // Elements with data-i18n attribute get their textContent replaced.
    // Elements with data-i18n-placeholder get their placeholder replaced.
    // Elements with data-i18n-title get their title replaced.
    // -----------------------------------------------------------------------
    function applyStaticTranslations() {
        document.querySelectorAll("[data-i18n]").forEach(function (el) {
            var key = el.getAttribute("data-i18n");
            if (key) el.textContent = t(key);
        });
        document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
            var key = el.getAttribute("data-i18n-placeholder");
            if (key) el.placeholder = t(key);
        });
        document.querySelectorAll("[data-i18n-title]").forEach(function (el) {
            var key = el.getAttribute("data-i18n-title");
            if (key) el.title = t(key);
        });
    }

    // -----------------------------------------------------------------------
    // Set locale and re-apply
    // -----------------------------------------------------------------------
    function setLocale(locale) {
        if (!locales[locale]) return;
        currentLocale = locale;
        localStorage.setItem("lazyenv_locale", locale);
        document.documentElement.lang = locale === "zh-CN" ? "zh-CN" : "en";
        applyStaticTranslations();
        // Dispatch event so script.js can re-render dynamic content
        window.dispatchEvent(new CustomEvent("lazyenv:localeChanged", { detail: { locale: locale } }));
    }

    function getLocale() {
        return currentLocale;
    }

    function getAvailableLocales() {
        return Object.keys(locales);
    }

    // -----------------------------------------------------------------------
    // Public API (attached to window)
    // -----------------------------------------------------------------------
    window.LazyEnvI18n = {
        t: t,
        setLocale: setLocale,
        getLocale: getLocale,
        getAvailableLocales: getAvailableLocales,
        applyStaticTranslations: applyStaticTranslations
    };

    // Apply on DOM ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            applyStaticTranslations();
        });
    } else {
        applyStaticTranslations();
    }

})();
