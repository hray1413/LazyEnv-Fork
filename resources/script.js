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
// LazyEnv - script.js
// ============================================================================

(function () {
    "use strict";

    var t = window.LazyEnvI18n.t;

    // -----------------------------------------------------------------------
    // State
    // -----------------------------------------------------------------------
    var currentPage = "home";
    var catalog = [];
    var selectedPackages = new Set();
    var installResults = new Map();
    var installLogs = new Map();
    var preInstallSnapshotId = "";
    var detectedEnvironments = [];
    var manualEnvironments = [];
    var installTotal = 0;
    var installCurrent = 0;
    var isMaximized = false;

    // -----------------------------------------------------------------------
    // Native bridge
    // -----------------------------------------------------------------------
    function sendNative(obj) {
        if (window.chrome && window.chrome.webview) {
            window.chrome.webview.postMessage(JSON.stringify(obj));
        } else {
            console.log("[LazyEnv -> Native]", obj);
            handleMock(obj);
        }
    }

    if (window.chrome && window.chrome.webview) {
        window.chrome.webview.addEventListener("message", function (e) {
            var data;
            try { data = typeof e.data === "string" ? JSON.parse(e.data) : e.data; } catch (_) { return; }
            handleNative(data);
        });
    }

    // -----------------------------------------------------------------------
    // Native response handler
    // -----------------------------------------------------------------------
    function handleNative(d) {
        switch (d.action) {
            case "environmentsDetected":
                detectedEnvironments = d.environments || [];
                renderEnvironments();
                break;

            case "probeResult":
                handleProbeResult(d);
                break;

            case "wingetStatus":
                renderCheckItem("winget", d.available);
                break;

            case "catalogData":
                catalog = d.packages || [];
                renderCatalog();
                break;

            case "installStarted":
                preInstallSnapshotId = d.snapshotId || "";
                showSnapshotInfo();
                break;

            case "installProgress":
                installResults.set(d.packageId, {
                    status: d.status,
                    message: d.message || "",
                    command: d.command || installResults.get(d.packageId)?.command || "",
                    output: d.output || "",
                    exitCode: d.exitCode
                });
                if (typeof d.current === "number") installCurrent = d.current;
                if (typeof d.total === "number") installTotal = d.total;
                renderProgress();
                updateProgressBar();
                break;

            case "installLog":
                if (!installLogs.has(d.packageId)) installLogs.set(d.packageId, []);
                var lines = installLogs.get(d.packageId);
                lines.push(d.line);
                if (lines.length > 200) lines.splice(0, lines.length - 200);
                updateLogPanel(d.packageId);
                break;

            case "installComplete":
                preInstallSnapshotId = d.snapshotId || preInstallSnapshotId;
                onInstallDone();
                break;

            case "snapshotCreated":
                loadSnapshots();
                break;

            case "snapshotList":
                renderSnapshots(d.snapshots || []);
                break;

            case "restoreResult":
                if (d.success) showToast(t("recovery.restoreSuccess"), "success");
                else showToast(t("recovery.restoreFailed"), "error");
                break;

            case "deleteResult":
                loadSnapshots();
                break;

            case "exportResult":
                if (d.success) showToast(t("recovery.exportSuccess"), "success");
                else showToast(t("recovery.exportFailed"), "error");
                break;

            case "importResult":
                if (d.success) {
                    showToast(t("recovery.importSuccess"), "success");
                    loadSnapshots();
                } else {
                    showToast(t("recovery.importFailed"), "error");
                }
                break;

            case "windowState":
                isMaximized = d.maximized;
                updateMaxBtn();
                break;

            case "uninstallResult":
                if (d.success) {
                    showToast(t("env.uninstallSuccess", d.command), "success");
                    sendNative({ action: "detectEnvironments" });
                } else {
                    showToast(t("env.uninstallFailed"), "error");
                }
                break;

            case "bcutProgress":
                handleBcutProgress(d);
                break;
        }
    }

    // -----------------------------------------------------------------------
    // Mock for dev (no native host)
    // -----------------------------------------------------------------------
    function handleMock(obj) {
        if (obj.action === "detectEnvironments") {
            setTimeout(function () {
                handleNative({
                    action: "environmentsDetected",
                    environments: [
                        { name: "Python", command: "python", version: "Python 3.12.0", category: "language" },
                        { name: "Node.js", command: "node", version: "v22.13.0", category: "language" },
                        { name: "Git", command: "git", version: "git version 2.43.0", category: "tool" },
                        { name: "CMake", command: "cmake", version: "cmake version 3.28.1", category: "tool" },
                        { name: "Rust (rustc)", command: "rustc", version: "rustc 1.75.0", category: "language" },
                        { name: "Docker", command: "docker", version: "Docker version 24.0.7", category: "runtime" },
                        { name: "curl", command: "curl", version: "curl 8.4.0", category: "utility" },
                        { name: "Google Chrome", command: "Google Chrome", version: "installed", category: "browser" },
                        { name: "嗶哩嗶哩", command: "嗶哩嗶哩", version: "installed", category: "media" },
                    ]
                });
            }, 800);
        }
        if (obj.action === "probeCommand") {
            setTimeout(function () {
                handleNative({
                    action: "probeResult",
                    found: true,
                    name: obj.command,
                    command: obj.command,
                    version: obj.command + " 0.1.0 (mock)",
                    category: obj.category || "other"
                });
            }, 600);
        }
        if (obj.action === "checkWinget") {
            setTimeout(function () { handleNative({ action: "wingetStatus", available: true }); }, 300);
        }
        if (obj.action === "getCatalog") {
            setTimeout(function () {
                handleNative({
                    action: "catalogData",
                    packages: [
                        { id: "Python.Python.3.12", name: "Python 3.12", category: "language", description: "General-purpose programming language" },
                        { id: "OpenJS.NodeJS.LTS", name: "Node.js (LTS)", category: "language", description: "JavaScript runtime built on V8" },
                        { id: "Rustlang.Rustup", name: "Rust (rustup)", category: "language", description: "Systems programming language" },
                        { id: "GoLang.Go", name: "Go", category: "language", description: "Statically typed compiled language" },
                        { id: "Git.Git", name: "Git", category: "tool", description: "Distributed version control" },
                        { id: "Kitware.CMake", name: "CMake", category: "tool", description: "Build system generator" },
                        { id: "Microsoft.VisualStudioCode", name: "VS Code", category: "editor", description: "Code editor by Microsoft" },
                        { id: "Docker.DockerDesktop", name: "Docker Desktop", category: "runtime", description: "Container platform" },
                        { id: "Google.Chrome", name: "Google Chrome", category: "browser", description: "Fast and secure web browser by Google" },
                        { id: "Mozilla.Firefox", name: "Mozilla Firefox", category: "browser", description: "Open-source web browser by Mozilla" },
                        { id: "Microsoft.Edge", name: "Microsoft Edge", category: "browser", description: "Chromium-based browser by Microsoft" },
                        { id: "Brave.Brave", name: "Brave Browser", category: "browser", description: "Privacy-focused Chromium-based browser" },
                        { id: "Bilibili.Bilibili", name: "嗶哩嗶哩", category: "media", description: "Bilibili desktop client for Windows" },
                    ]
                });
            }, 200);
        }
        if (obj.action === "install") {
            setTimeout(function () { handleNative({ action: "installStarted", snapshotId: "mock-snap" }); }, 100);
            var pkgs = obj.packages || [];
            pkgs.forEach(function (id, i) {
                var cmd = "winget install --id " + id + " --exact --silent --accept-package-agreements --accept-source-agreements";
                setTimeout(function () {
                    handleNative({ action: "installProgress", packageId: id, status: "running", message: "Installing...", command: cmd, current: i, total: pkgs.length });
                }, 300 + i * 2500);
                for (var l = 0; l < 5; l++) {
                    (function(line, pkgId) {
                        setTimeout(function () {
                            handleNative({ action: "installLog", packageId: pkgId, line: "  [mock] Processing step " + (line + 1) + "..." });
                        }, 600 + i * 2500 + line * 300);
                    })(l, id);
                }
                var success = Math.random() > 0.3;
                setTimeout(function () {
                    handleNative({
                        action: "installProgress", packageId: id,
                        status: success ? "success" : "failed",
                        message: success ? "Done" : "Error: package not found",
                        command: cmd,
                        output: success ? "" : "ERROR: No package found matching input criteria.",
                        exitCode: success ? 0 : 1,
                        current: i + 1, total: pkgs.length
                    });
                }, 1800 + i * 2500);
            });
            setTimeout(function () { handleNative({ action: "installComplete", snapshotId: "mock-snap" }); }, 2500 + pkgs.length * 2500);
        }
        if (obj.action === "retryInstall") {
            var rid = obj.packageId;
            var rcmd = "winget install --id " + rid + " --exact --silent --accept-package-agreements --accept-source-agreements";
            setTimeout(function () { handleNative({ action: "installProgress", packageId: rid, status: "running", message: "Retrying...", command: rcmd }); }, 200);
            setTimeout(function () { handleNative({ action: "installProgress", packageId: rid, status: "success", message: "Done", command: rcmd, output: "", exitCode: 0 }); }, 2000);
        }
        if (obj.action === "listSnapshots") {
            setTimeout(function () { handleNative({ action: "snapshotList", snapshots: [] }); }, 200);
        }
        if (obj.action === "windowMinimize" || obj.action === "windowMaximize" || obj.action === "windowClose" || obj.action === "windowDragStart") {
            console.log("Window action:", obj.action);
        }
        if (obj.action === "installBcut") {
            setTimeout(function () {
                handleNative({ action: "bcutProgress", status: "downloading", message: "正在下載必剪安裝包..." });
            }, 300);
            setTimeout(function () {
                handleNative({ action: "bcutProgress", status: "installing", message: "正在執行必剪安裝程式..." });
            }, 1800);
            setTimeout(function () {
                handleNative({ action: "bcutProgress", status: "success", message: "必剪安裝程式已啟動，請依照指示完成安裝。" });
            }, 2800);
        }
    }

    // -----------------------------------------------------------------------
    // Navigation
    // -----------------------------------------------------------------------
    function navigateTo(page) {
        currentPage = page;
        document.querySelectorAll(".page").forEach(function (p) {
            p.classList.toggle("active", p.dataset.page === page);
        });
        document.querySelectorAll(".sidebar__item").forEach(function (item) {
            item.classList.toggle("active", item.dataset.page === page);
        });

        if (page === "home") sendNative({ action: "detectEnvironments" });
        if (page === "check") initCheck();
        if (page === "packages" && catalog.length === 0) sendNative({ action: "getCatalog" });
        if (page === "recovery") loadSnapshots();
        if (page === "summary") renderSummary();
    }

    document.getElementById("sidebar").addEventListener("click", function (e) {
        var item = e.target.closest(".sidebar__item");
        if (item && item.dataset.page) navigateTo(item.dataset.page);
    });

    // -----------------------------------------------------------------------
    // Language switcher
    // -----------------------------------------------------------------------
    var langSelect = document.getElementById("langSelect");
    langSelect.value = window.LazyEnvI18n.getLocale();

    langSelect.addEventListener("change", function () {
        window.LazyEnvI18n.setLocale(langSelect.value);
    });

    window.addEventListener("lazyenv:localeChanged", function () {
        t = window.LazyEnvI18n.t;
        renderEnvironments(document.getElementById("envSearch").value);
        if (currentPage === "check") renderChecks();
        if (catalog.length > 0) renderCatalog(document.getElementById("pkgSearch").value);
        updatePkgUI();
        if (installResults.size > 0) {
            renderProgress();
            updateProgressBar();
        }
        if (currentPage === "recovery") loadSnapshots();
        if (currentPage === "summary") renderSummary();
    });

    // -----------------------------------------------------------------------
    // Window controls
    // -----------------------------------------------------------------------
    document.getElementById("btnMin").addEventListener("click", function () {
        sendNative({ action: "windowMinimize" });
    });
    document.getElementById("btnMax").addEventListener("click", function () {
        sendNative({ action: "windowMaximize" });
    });
    document.getElementById("btnClose").addEventListener("click", function () {
        sendNative({ action: "windowClose" });
    });

    document.getElementById("titlebarDrag").addEventListener("dblclick", function () {
        sendNative({ action: "windowMaximize" });
    });

    document.getElementById("titlebarDrag").addEventListener("mousedown", function (e) {
        if (e.button !== 0) return;
        if (e.target.closest("button") || e.target.closest("input") || e.target.closest("a")) return;
        sendNative({ action: "windowDragStart" });
    });

    function updateMaxBtn() {
        var svg = document.getElementById("btnMax").querySelector("svg");
        if (isMaximized) {
            svg.innerHTML = '<rect x="2" y="0" width="7" height="7" stroke="currentColor" stroke-width="1" fill="none"/><rect x="0" y="2" width="7" height="7" stroke="currentColor" stroke-width="1" fill="var(--bg-base)"/>';
        } else {
            svg.innerHTML = '<rect x="0.5" y="0.5" width="9" height="9" stroke="currentColor" stroke-width="1" fill="none"/>';
        }
    }

    // -----------------------------------------------------------------------
    // Home: Installed Environments
    // -----------------------------------------------------------------------
    function getAllEnvironments() {
        var seen = new Set();
        var all = [];
        detectedEnvironments.forEach(function (e) {
            seen.add(e.command.toLowerCase());
            all.push(e);
        });
        manualEnvironments.forEach(function (e) {
            if (!seen.has(e.command.toLowerCase())) {
                seen.add(e.command.toLowerCase());
                all.push(e);
            }
        });
        return all;
    }

    function getCategoryLabel(cat) {
        var key = "category." + cat;
        var result = t(key);
        return result === key ? cat : result;
    }

    function renderEnvironments(filter) {
        var container = document.getElementById("envContainer");
        var envs = getAllEnvironments();

        if (filter) {
            var f = filter.toLowerCase();
            envs = envs.filter(function (e) {
                return e.name.toLowerCase().includes(f) || e.version.toLowerCase().includes(f) || e.category.toLowerCase().includes(f);
            });
        }

        if (envs.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-state__text">' +
                (detectedEnvironments.length === 0 && manualEnvironments.length === 0 ? t("env.scanning") : t("env.noMatch")) +
                '</div></div>';
            return;
        }

        var groups = {};
        var order = ["language", "tool", "runtime", "utility", "editor", "database", "browser", "media", "other"];
        envs.forEach(function (e) {
            var cat = e.category || "other";
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(e);
        });

        var html = "";
        order.concat(Object.keys(groups).filter(function (k) { return order.indexOf(k) === -1; })).forEach(function (cat) {
            if (!groups[cat]) return;
            html += '<div class="category-group"><div class="category-group__title">' + esc(getCategoryLabel(cat)) + ' (' + groups[cat].length + ')</div><div class="env-grid">';
            groups[cat].forEach(function (e) {
                var initials = e.name.substring(0, 2).toUpperCase();
                html += '<div class="env-card" data-cmd="' + esc(e.command) + '">' +
                    '<div class="env-card__icon env-card__icon--' + esc(e.category) + '">' + initials + '</div>' +
                    '<div class="env-card__info">' +
                    '<div class="env-card__name">' + esc(e.name) + '</div>' +
                    '<div class="env-card__version">' + esc(e.version) + '</div>' +
                    '</div>' +
                    '<div class="env-card__actions">' +
                    '<button class="btn btn--ghost btn--xs btn-uninstall" title="' + esc(t("env.btnUninstall")) + '">' + esc(t("env.btnUninstall")) + '</button>' +
                    '</div></div>';
            });
            html += '</div></div>';
        });

        container.innerHTML = html;

        container.querySelectorAll(".btn-uninstall").forEach(function (btn) {
            btn.addEventListener("click", function (ev) {
                ev.stopPropagation();
                var card = btn.closest(".env-card");
                var name = card.querySelector(".env-card__name").textContent;
                if (confirm(t("env.confirmUninstall", name))) {
                    sendNative({ action: "uninstallPackage", command: name });
                }
            });
        });
    }

    document.getElementById("envSearch").addEventListener("input", function (e) {
        renderEnvironments(e.target.value);
    });

    document.getElementById("btnRefreshEnv").addEventListener("click", function () {
        document.getElementById("envContainer").innerHTML =
            '<div class="skeleton skeleton-card"></div><div class="skeleton skeleton-card"></div><div class="skeleton skeleton-card"></div>';
        detectedEnvironments = [];
        sendNative({ action: "detectEnvironments" });
    });

    // -----------------------------------------------------------------------
    // Home: Manual Add Environment
    // -----------------------------------------------------------------------
    var addEnvPanel = document.getElementById("addEnvPanel");

    document.getElementById("btnAddEnv").addEventListener("click", function () {
        addEnvPanel.style.display = addEnvPanel.style.display === "none" ? "block" : "none";
        if (addEnvPanel.style.display === "block") {
            document.getElementById("addEnvCommand").focus();
        }
    });

    document.getElementById("btnCloseAddEnv").addEventListener("click", function () {
        addEnvPanel.style.display = "none";
    });

    document.getElementById("btnProbeEnv").addEventListener("click", function () {
        var cmd = document.getElementById("addEnvCommand").value.trim();
        if (!cmd) return;
        var cat = document.getElementById("addEnvCategory").value;
        var status = document.getElementById("probeStatus");
        status.textContent = t("probe.detecting");
        status.className = "add-env-form__status loading";
        sendNative({ action: "probeCommand", command: cmd, category: cat });
    });

    document.getElementById("addEnvCommand").addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            document.getElementById("btnProbeEnv").click();
        }
    });

    function handleProbeResult(d) {
        var status = document.getElementById("probeStatus");
        if (d.found) {
            status.textContent = t("probe.found", d.version);
            status.className = "add-env-form__status success";
            manualEnvironments.push({
                name: d.name,
                command: d.command,
                version: d.version,
                category: d.category || "other"
            });
            document.getElementById("addEnvCommand").value = "";
            renderEnvironments(document.getElementById("envSearch").value);
            showToast(t("probe.addedToast", d.name, d.version), "success");
        } else {
            status.textContent = d.message || t("probe.notFound");
            status.className = "add-env-form__status error";
        }
    }

    // -----------------------------------------------------------------------
    // System Check
    // -----------------------------------------------------------------------
    var checkStates = { os: null, webview2: true, winget: null };

    function initCheck() {
        checkStates.os = "Windows";
        sendNative({ action: "checkWinget" });
        renderChecks();
    }

    function renderCheckItem(name, ok) {
        checkStates[name] = ok;
        renderChecks();
    }

    function renderChecks() {
        var items = [
            { label: t("check.os"), value: checkStates.os || t("check.detecting"), ok: checkStates.os === "Windows" ? "ok" : null },
            { label: t("check.webview2"), value: t("check.available"), ok: "ok" },
            { label: t("check.winget"), value: checkStates.winget === null ? t("check.checking") : (checkStates.winget ? t("check.available") : t("check.notFound")), ok: checkStates.winget === null ? null : (checkStates.winget ? "ok" : "fail") }
        ];

        document.getElementById("checkList").innerHTML = items.map(function (c) {
            var icon = "";
            if (c.ok === "ok") icon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="var(--success)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
            else if (c.ok === "fail") icon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="var(--error)"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>';
            else icon = '<div class="spinner" style="width:16px;height:16px;border-width:1.5px;"></div>';
            return '<div class="check-item"><div class="check-item__icon">' + icon + '</div><div class="check-item__label">' + esc(c.label) + '</div><div class="check-item__value">' + esc(c.value) + '</div></div>';
        }).join("");
    }

    // -----------------------------------------------------------------------
    // Packages
    // -----------------------------------------------------------------------
    function renderCatalog(filter) {
        var container = document.getElementById("catalogContainer");
        var pkgs = catalog;

        if (filter) {
            var f = filter.toLowerCase();
            pkgs = pkgs.filter(function (p) {
                return p.name.toLowerCase().includes(f) || p.id.toLowerCase().includes(f) || p.category.toLowerCase().includes(f);
            });
        }

        var groups = {};
        var order = ["language", "tool", "editor", "runtime", "database", "utility", "browser", "media"];
        pkgs.forEach(function (p) {
            var cat = p.category || "other";
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(p);
        });

        var html = "";
        order.concat(Object.keys(groups).filter(function (k) { return order.indexOf(k) === -1; })).forEach(function (cat) {
            if (!groups[cat]) return;
            html += '<div class="category-group"><div class="category-group__title">' + esc(getCategoryLabel(cat)) + '</div><div class="pkg-grid">';
            groups[cat].forEach(function (p) {
                var sel = selectedPackages.has(p.id) ? " selected" : "";
                html += '<div class="pkg-card' + sel + '" data-id="' + esc(p.id) + '">' +
                    '<div class="pkg-card__check"><svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg></div>' +
                    '<div><div class="pkg-card__name">' + esc(p.name) + '</div>' +
                    '<div class="pkg-card__desc">' + esc(p.description) + '</div></div></div>';
            });
            html += '</div></div>';
        });

        container.innerHTML = html;

        container.querySelectorAll(".pkg-card").forEach(function (card) {
            card.addEventListener("click", function () {
                var id = card.dataset.id;
                if (selectedPackages.has(id)) { selectedPackages.delete(id); card.classList.remove("selected"); }
                else { selectedPackages.add(id); card.classList.add("selected"); }
                updatePkgUI();
            });
        });
    }

    function updatePkgUI() {
        var n = selectedPackages.size;
        var btn = document.getElementById("btnStartInstall");
        btn.disabled = n === 0;
        var span = btn.querySelector("span[data-i18n]");
        if (span) {
            span.textContent = t("packages.btnInstall", n);
        } else {
            btn.textContent = t("packages.btnInstall", n);
        }
        var badge = document.getElementById("pkgBadge");
        if (n > 0) { badge.style.display = ""; badge.textContent = n; }
        else { badge.style.display = "none"; }
    }

    document.getElementById("pkgSearch").addEventListener("input", function (e) {
        renderCatalog(e.target.value);
    });

    document.getElementById("btnStartInstall").addEventListener("click", function () {
        if (selectedPackages.size === 0) return;
        navigateTo("install");
        startInstall();
    });

    // -----------------------------------------------------------------------
    // 必剪 (Bcut) special installer
    // -----------------------------------------------------------------------
    var bcutBtn = document.getElementById("btnInstallBcut");

    if (bcutBtn) {
        bcutBtn.addEventListener("click", function () {
            sendNative({ action: "installBcut" });
            setBcutStatus("downloading", "⬇ 下載中...");
            bcutBtn.disabled = true;
        });
    }

    function setBcutStatus(type, message) {
        var el = document.getElementById("bcutStatus");
        if (!el) return;
        el.textContent = message;
        el.className = "special-pkg-card__status status--" + type;
    }

    function handleBcutProgress(d) {
        var labels = {
            downloading: "⬇ 下載中...",
            installing:  "⚙ 安裝程式執行中...",
            success:     "✓ 安裝程式已啟動",
            failed:      "✗ 失敗：" + (d.message || "")
        };
        setBcutStatus(d.status, labels[d.status] || d.message || "");

        if (d.status === "success") {
            showToast("必剪安裝程式已啟動，請依照指示完成安裝。", "success");
        }
        if (d.status === "failed") {
            showToast("必剪下載失敗：" + (d.message || ""), "error");
            if (bcutBtn) bcutBtn.disabled = false;
        }
    }

    // -----------------------------------------------------------------------
    // Installation
    // -----------------------------------------------------------------------
    function startInstall() {
        installResults.clear();
        installLogs.clear();
        installTotal = selectedPackages.size;
        installCurrent = 0;
        selectedPackages.forEach(function (id) {
            installResults.set(id, { status: "pending", message: t("install.waiting"), command: "", output: "" });
            installLogs.set(id, []);
        });
        renderProgress();
        updateProgressBar();
        document.getElementById("installProgressWrap").style.display = "block";
        sendNative({ action: "install", packages: Array.from(selectedPackages) });
    }

    function renderProgress() {
        var list = document.getElementById("progressList");
        var html = "";

        installResults.forEach(function (r, id) {
            var pkg = catalog.find(function (p) { return p.id === id; });
            var name = pkg ? pkg.name : id;
            var iconHtml = "";
            var cls = "";
            var statusText = "";

            switch (r.status) {
                case "pending":
                    iconHtml = '<div style="width:16px;height:16px;border-radius:50%;background:var(--bg-tertiary);"></div>';
                    statusText = t("install.pending");
                    break;
                case "running":
                    iconHtml = '<div class="spinner"></div>';
                    cls = " running";
                    statusText = t("install.installing");
                    break;
                case "success":
                    iconHtml = '<svg width="18" height="18" viewBox="0 0 24 24" fill="var(--success)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
                    cls = " success";
                    statusText = t("install.installed");
                    break;
                case "failed":
                    iconHtml = '<svg width="18" height="18" viewBox="0 0 24 24" fill="var(--error)"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>';
                    cls = " failed";
                    statusText = t("install.failed", r.exitCode);
                    break;
                case "skipped":
                    iconHtml = '<svg width="18" height="18" viewBox="0 0 24 24" fill="var(--warning)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>';
                    cls = " skipped";
                    statusText = t("install.skipped");
                    break;
            }

            html += '<div class="progress-item' + cls + '" data-pkg-id="' + esc(id) + '">';
            html += '<div class="progress-item__header">';
            html += '<div class="progress-item__icon">' + iconHtml + '</div>';
            html += '<div class="progress-item__name">' + esc(name) + '</div>';
            html += '<div class="progress-item__status">' + esc(statusText) + '</div>';

            if (r.status === "failed") {
                html += '<div class="progress-item__actions">';
                html += '<button class="btn btn--primary btn--xs btn-retry" data-id="' + esc(id) + '">' + esc(t("install.btnRetry")) + '</button>';
                html += '</div>';
            }
            html += '</div>';

            html += '<div class="progress-item__detail">';
            if (r.command) {
                html += '<div class="progress-item__cmd">' + esc(r.command) + '</div>';
            }

            var logLines = installLogs.get(id) || [];
            if (logLines.length > 0 || r.status === "running") {
                html += '<div class="progress-item__log" id="log-' + esc(id) + '">';
                logLines.forEach(function (line) {
                    html += '<span class="log-line">' + esc(line) + '</span>';
                });
                if (r.status === "running" && logLines.length === 0) {
                    html += '<span class="log-line" style="color:var(--text-tertiary);">' + esc(t("install.waitingOutput")) + '</span>';
                }
                html += '</div>';
            }

            if (r.status === "failed" && r.output) {
                html += '<div class="progress-item__output">' + esc(r.output) + '</div>';
            }
            html += '</div>';
            html += '</div>';
        });

        list.innerHTML = html || '<div class="empty-state"><div class="empty-state__text">' + esc(t("install.noPackages")) + '</div></div>';

        list.querySelectorAll(".btn-retry").forEach(function (btn) {
            btn.addEventListener("click", function () {
                var pkgId = btn.dataset.id;
                installResults.set(pkgId, { status: "pending", message: t("install.retrying"), command: "", output: "" });
                installLogs.set(pkgId, []);
                renderProgress();
                sendNative({ action: "retryInstall", packageId: pkgId });
            });
        });

        installResults.forEach(function (r, id) {
            if (r.status === "running") {
                var logEl = document.getElementById("log-" + id);
                if (logEl) logEl.scrollTop = logEl.scrollHeight;
            }
        });
    }

    function updateLogPanel(packageId) {
        var logEl = document.getElementById("log-" + packageId);
        if (!logEl) {
            renderProgress();
            return;
        }
        var lines = installLogs.get(packageId) || [];
        var html = "";
        lines.forEach(function (line) {
            html += '<span class="log-line">' + esc(line) + '</span>';
        });
        logEl.innerHTML = html;
        logEl.scrollTop = logEl.scrollHeight;
    }

    function updateProgressBar() {
        var bar = document.getElementById("installBar");
        var text = document.getElementById("installProgressText");
        var pct = document.getElementById("installProgressPct");

        var done = 0;
        var failed = 0;
        installResults.forEach(function (r) {
            if (r.status === "success" || r.status === "skipped" || r.status === "failed") done++;
            if (r.status === "failed") failed++;
        });

        var total = installResults.size || 1;
        var percent = Math.round((done / total) * 100);

        bar.style.width = percent + "%";
        bar.classList.toggle("error", failed > 0 && done === total);
        text.textContent = t("install.progressText", done, total);
        pct.textContent = percent + "%";
    }

    function showSnapshotInfo() {
        var el = document.getElementById("installSnapshotInfo");
        if (preInstallSnapshotId) {
            el.style.display = "block";
            el.textContent = t("recovery.snapshotCreated", preInstallSnapshotId);
        }
    }

    function onInstallDone() {
        updateProgressBar();
        renderProgress();
    }

    // -----------------------------------------------------------------------
    // Recovery
    // -----------------------------------------------------------------------
    function loadSnapshots() {
        sendNative({ action: "listSnapshots" });
    }

    function renderSnapshots(snaps) {
        var list = document.getElementById("snapshotList");
        if (snaps.length === 0) {
            list.innerHTML = '<div class="empty-state"><div class="empty-state__text">' + esc(t("recovery.emptyState")) + '</div></div>';
            return;
        }

        list.innerHTML = snaps.map(function (s) {
            return '<div class="snapshot-card" data-id="' + esc(s.id) + '">' +
                '<div class="snapshot-card__info">' +
                '<div class="snapshot-card__desc">' + esc(s.description) + '</div>' +
                '<div class="snapshot-card__meta">' + esc(s.id) + ' | ' + esc(s.timestamp) +
                ' | ' + t("recovery.userCount", s.userVarCount || 0) + ' | ' + t("recovery.systemCount", s.systemVarCount || 0) + '</div>' +
                '</div><div class="snapshot-card__actions">' +
                '<button class="btn btn--primary btn--xs btn-restore">' + esc(t("recovery.btnRestore")) + '</button>' +
                '<button class="btn btn--secondary btn--xs btn-export">' + esc(t("recovery.btnExport")) + '</button>' +
                '<button class="btn btn--danger btn--xs btn-delete">' + esc(t("recovery.btnDelete")) + '</button>' +
                '</div></div>';
        }).join("");

        list.querySelectorAll(".snapshot-card").forEach(function (card) {
            var id = card.dataset.id;
            card.querySelector(".btn-restore").addEventListener("click", function (e) {
                e.stopPropagation();
                if (confirm(t("recovery.confirmRestore"))) {
                    sendNative({ action: "restoreSnapshot", snapshotId: id });
                }
            });
            card.querySelector(".btn-export").addEventListener("click", function (e) {
                e.stopPropagation();
                sendNative({ action: "exportSnapshot", snapshotId: id });
            });
            card.querySelector(".btn-delete").addEventListener("click", function (e) {
                e.stopPropagation();
                if (confirm(t("recovery.confirmDelete"))) {
                    sendNative({ action: "deleteSnapshot", snapshotId: id });
                }
            });
        });
    }

    document.getElementById("btnCreateSnapshot").addEventListener("click", function () {
        var desc = prompt(t("recovery.promptDesc"));
        sendNative({ action: "createSnapshot", description: desc || t("recovery.defaultDesc") });
    });

    document.getElementById("btnImportSnapshot").addEventListener("click", function () {
        sendNative({ action: "importSnapshot" });
    });

    document.getElementById("btnRefreshSnapshots").addEventListener("click", function () {
        loadSnapshots();
    });

    // -----------------------------------------------------------------------
    // Summary
    // -----------------------------------------------------------------------
    function renderSummary() {
        var tbody = document.getElementById("summaryBody");
        var html = "";
        installResults.forEach(function (r, id) {
            var pkg = catalog.find(function (p) { return p.id === id; });
            var name = pkg ? pkg.name : id;
            var badgeCls = "";
            var badgeText = "";
            switch (r.status) {
                case "success": badgeCls = "badge-status--success"; badgeText = t("summary.success"); break;
                case "failed":  badgeCls = "badge-status--error";   badgeText = t("summary.failed");  break;
                case "skipped": badgeCls = "badge-status--skipped"; badgeText = t("summary.skipped"); break;
                default:        badgeCls = "badge-status--running"; badgeText = r.status;  break;
            }
            html += '<tr><td>' + esc(name) + '</td>' +
                '<td><span class="badge-status ' + badgeCls + '">' + badgeText + '</span></td>' +
                '<td style="font-family:var(--font-mono);font-size:11px;color:var(--text-tertiary);max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + esc(r.command || "-") + '</td>' +
                '<td style="font-size:11px;color:var(--text-tertiary);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + esc(r.output || r.message || "-") + '</td></tr>';
        });
        tbody.innerHTML = html || '<tr><td colspan="4" style="text-align:center;color:var(--text-tertiary);">' + esc(t("summary.emptyState")) + '</td></tr>';
    }

    // -----------------------------------------------------------------------
    // Toast notification
    // -----------------------------------------------------------------------
    function showToast(msg, type) {
        var el = document.createElement("div");
        el.className = "toast" + (type ? " toast--" + type : "");
        el.textContent = msg;
        document.body.appendChild(el);
        setTimeout(function () { el.style.opacity = "0"; el.style.transition = "opacity 300ms"; }, 2500);
        setTimeout(function () { el.remove(); }, 3000);
    }

    // -----------------------------------------------------------------------
    // Utility
    // -----------------------------------------------------------------------
    function esc(s) {
        if (!s) return "";
        var d = document.createElement("div");
        d.textContent = s;
        return d.innerHTML;
    }

    // -----------------------------------------------------------------------
    // Init
    // -----------------------------------------------------------------------
    navigateTo("home");

})();
