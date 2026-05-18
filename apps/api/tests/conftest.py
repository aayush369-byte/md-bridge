"""Shared fixtures for API tests."""
from __future__ import annotations

from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from app.config import REPO_ROOT
from app.main import create_app


@pytest.fixture
def client() -> TestClient:
    return TestClient(create_app())


@pytest.fixture
def fixtures_dir() -> Path:
    return REPO_ROOT / "Arquivos-pdf" / "Design Digital"


@pytest.fixture
def small_pdf(fixtures_dir: Path) -> Path:
    """ddp-factsheet-en.pdf is the smallest in the fixture set."""
    p = fixtures_dir / "ddp-factsheet-en.pdf"
    assert p.exists(), f"missing fixture: {p}"
    return p


@pytest.fixture
def tagged_pdf() -> Path:
    """An IREB syllabus expected to be tagged (PDF/UA). Used to validate /api/inspect-pdf."""
    candidates = [
        REPO_ROOT / "Arquivos-pdf" / "Requisito" / "cpre_foundationlevel_syllabus_br_v.3.2.2.pdf",
        REPO_ROOT / "Arquivos-pdf" / "Requisito" / "ireb_cpre_re@agileprimersyllabusandstudyguide_pt_v1.4.pdf",
    ]
    for p in candidates:
        if p.exists():
            return p
    pytest.skip(f"no tagged-syllabus fixture available, tried: {candidates}")
