"""Regression tests for the vendored pdf-to-markdown link annotator."""
from __future__ import annotations

from app.services.packages_loader import pdf_to_md_module


def _make_block(mod):
    span = mod.Span(
        text="hello",
        size=11.0,
        font="Body",
        flags=0,
        bbox=(10.0, 10.0, 50.0, 20.0),
    )
    line = mod.Line(spans=[span], bbox=(10.0, 10.0, 50.0, 20.0))
    block = mod.Block(lines=[line], bbox=(10.0, 10.0, 50.0, 20.0))
    return block, span


def test_annotate_spans_with_links_handles_string_page_destination():
    # PyMuPDF returns link["page"] as a str when a named destination cannot be
    # resolved to a numeric page index. The old code did `page_dest >= 0`
    # against the string and crashed with TypeError. The fix coerces safely
    # and skips the link.
    mod = pdf_to_md_module()
    block, span = _make_block(mod)
    page_links = [{"from": (5.0, 5.0, 60.0, 25.0), "page": "Chapter1"}]

    mod.annotate_spans_with_links([block], page_links)

    assert span.link is None


def test_annotate_spans_with_links_resolves_int_page_destination():
    mod = pdf_to_md_module()
    block, span = _make_block(mod)
    page_links = [{"from": (5.0, 5.0, 60.0, 25.0), "page": 3}]

    mod.annotate_spans_with_links([block], page_links)

    assert span.link == "#page-4"


def test_annotate_spans_with_links_ignores_negative_page():
    mod = pdf_to_md_module()
    block, span = _make_block(mod)
    page_links = [{"from": (5.0, 5.0, 60.0, 25.0), "page": -1}]

    mod.annotate_spans_with_links([block], page_links)

    assert span.link is None
