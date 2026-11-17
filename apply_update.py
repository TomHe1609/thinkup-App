#!/usr/bin/env python3
"""ThinkUp.learn · CSS-only glass redesign installer with neutral learning examples.

Usage: python apply_update.py /path/to/thinkup-App
       python apply_update.py   # if run from the repository root

This script does not change learning logic or identifiers.
"""
from __future__ import annotations

import datetime as dt
import re
import shutil
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = Path(sys.argv[1]).expanduser().resolve() if len(sys.argv) > 1 else Path.cwd().resolve()
NEEDED = ["index.html", "learning-support.css", "sw.js", "data-m01-m09.json"]
missing = [name for name in NEEDED if not (ROOT / name).is_file()]
if missing:
    raise SystemExit(f"Kein vollständiges thinkup-App-Repository in {ROOT}. Fehlend: {', '.join(missing)}")

index_source = (ROOT / "index.html").read_text(encoding="utf-8")
if "thinkup.learn" not in index_source or "moduleNavigation" not in index_source:
    raise SystemExit("index.html sieht nicht wie die veröffentlichte ThinkUp.learn-App aus; nichts geändert.")

css = (HERE / "ui-glass.css").read_text(encoding="utf-8")
if ".node .ball" not in css or "[data-color-mode=\"light\"]" not in css:
    raise SystemExit("ui-glass.css ist unvollständig; nichts geändert.")

support = (ROOT / "learning-support.css").read_text(encoding="utf-8")
support = re.sub(r'^\s*/\* Visual refresh[^\n]*\*/\s*', "", support, count=1)
support = re.sub(r'(?m)^/\* ThinkUp\.learn Glass UI[^\n]*\*/\n', "", support)
support = re.sub(r'(?m)^\s*@import\s+url\(["\']\./(?:ui-refinement|ui-glass)\.css["\']\);\s*', "", support)
support = ('/* ThinkUp.learn Glass UI – alle bisherigen Lernfunktionen bleiben erhalten. */\n'
           '@import url("./ui-glass.css");\n\n' + support.lstrip())

sw = (ROOT / "sw.js").read_text(encoding="utf-8")
if not re.search(r"const CACHE\s*=\s*PREFIX\s*\+", sw) or "const FILES=" not in sw:
    raise SystemExit("Unbekannte Service-Worker-Struktur; nichts geändert.")
sw = re.sub(r"const CACHE\s*=\s*PREFIX\s*\+\s*'[^']*';",
            "const CACHE=PREFIX+'thinkup-applied-quizzes-v23-glass-v2';", sw, count=1)
sw = sw.replace(",'./ui-refinement.css'", "")
if "'./ui-glass.css'" not in sw:
    anchor = "'./learning-support.css'"
    if anchor not in sw:
        raise SystemExit("Offline-Cacheliste enthält learning-support.css nicht; nichts geändert.")
    sw = sw.replace(anchor, anchor + ",'./ui-glass.css'", 1)

needle = "Tom hat vollständige Cornell-Notizen"
replacement = "Eine Person hat vollständige Cornell-Notizen"
index_new = index_source.replace(needle, replacement)
data_old = (ROOT / "data-m01-m09.json").read_text(encoding="utf-8")
data_new = data_old.replace(needle, replacement)

changes = {
    "ui-glass.css": css,
    "learning-support.css": support,
    "sw.js": sw,
    "index.html": index_new,
    "data-m01-m09.json": data_new,
}
modified = {name: content for name, content in changes.items()
            if not (ROOT / name).is_file() or (ROOT / name).read_text(encoding="utf-8") != content}
if not modified:
    print("Bereits aktuell: alle UI-Dateien sind installiert.")
    sys.exit(0)

# Reversible backups outside the Git repository, so they will not be published by Pages.
backup = ROOT.parent / f"{ROOT.name}-backup-before-glass-{dt.datetime.now():%Y%m%d-%H%M%S-%f}"
backup.mkdir(parents=True, exist_ok=False)
for name in modified:
    if (ROOT / name).exists():
        shutil.copy2(ROOT / name, backup / name)
for name, content in modified.items():
    (ROOT / name).write_text(content, encoding="utf-8")
print("ThinkUp.learn wurde auf Glass UI 2.0 vorbereitet.")
print("Geänderte Dateien:", ", ".join(modified))
print("Sicherungen unter:", backup)
print("Nächste Schritte: npm test && npm run test:browser, danach git commit/push.")
