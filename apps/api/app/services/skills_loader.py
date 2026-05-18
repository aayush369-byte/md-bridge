"""Load skill scripts as Python modules without modifying them.

The skills live under `.claude/skills/<skill>/scripts/` outside this package,
so we resolve them by path via importlib.util and cache the loaded modules.
"""
from __future__ import annotations

import importlib.util
import re
import sys
from functools import lru_cache
from pathlib import Path
from types import ModuleType

from app.config import MD_TO_PDF_SCRIPT, PDF_INSPECT_SCRIPT, PDF_TO_MD_SCRIPT


_STDIO_REBIND_RE = re.compile(
    r"^[ \t]*sys\.std(?:out|err)[ \t]*=[ \t]*io\.TextIOWrapper\(sys\.std(?:out|err)\.buffer.*$",
    re.MULTILINE,
)


def _load(name: str, path: Path) -> ModuleType:
    """Import a skill script by path without letting it hijack the host stdout.

    The CLI scripts rebind `sys.stdout` / `sys.stderr` to UTF-8 TextIOWrappers
    at module import time so they print correctly when run from the command
    line on Windows. Inside a server / test process that is fatal: the wrapper
    grabs the buffer of pytest's capture tmpfile and, when the wrapper is later
    garbage-collected, closes that tmpfile. Subsequent capture reads then fail
    with `ValueError: I/O operation on closed file`.

    We read the source, comment those lines out, compile, and exec_module — so
    the skill modules import cleanly without touching host stdio.
    """
    if not path.exists():
        raise FileNotFoundError(f"Skill script not found: {path}")
    source = path.read_text(encoding="utf-8")
    safe_source = _STDIO_REBIND_RE.sub(
        lambda m: "# [stripped by skills_loader] " + m.group(0), source
    )
    code = compile(safe_source, str(path), "exec")
    spec = importlib.util.spec_from_loader(name, loader=None, origin=str(path))
    if spec is None:
        raise ImportError(f"Cannot build import spec for {path}")
    module = importlib.util.module_from_spec(spec)
    module.__file__ = str(path)
    sys.modules[name] = module
    exec(code, module.__dict__)
    return module


@lru_cache(maxsize=1)
def pdf_to_md_module() -> ModuleType:
    return _load("md_bridge_skill_pdf_to_md", PDF_TO_MD_SCRIPT)


@lru_cache(maxsize=1)
def md_to_pdf_module() -> ModuleType:
    return _load("md_bridge_skill_md_to_pdf", MD_TO_PDF_SCRIPT)


@lru_cache(maxsize=1)
def pdf_inspect_module() -> ModuleType:
    return _load("md_bridge_skill_pdf_inspect", PDF_INSPECT_SCRIPT)
