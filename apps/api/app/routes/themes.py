"""Theme listing route."""
from __future__ import annotations

from fastapi import APIRouter

from app.config import MD_TO_PDF_TEMPLATES
from app.schemas.convert import Theme


router = APIRouter(tags=["themes"])


_HUMAN_NAMES = {
    "default": "Default A4",
    "editorial": "Editorial",
    "brand-edge": "Brand EDGE",
}


THEMES_DESCRIPTION = """
List the CSS themes installed for Markdown → PDF rendering.

Themes are files inside `packages/markdown-to-pdf/templates/`. To add a new
theme, drop a `<name>.css` file there. It will appear here on the next
request without restarting the server.
"""


@router.get(
    "/api/themes",
    response_model=list[Theme],
    summary="List available CSS themes",
    description=THEMES_DESCRIPTION,
    response_description="Array of themes; always contains at least `default`.",
    responses={
        200: {
            "content": {
                "application/json": {
                    "example": [
                        {"id": "default", "name": "Default A4", "preview_url": None},
                    ]
                }
            }
        }
    },
)
async def list_themes() -> list[Theme]:
    if not MD_TO_PDF_TEMPLATES.exists():
        return []
    out: list[Theme] = []
    for css in sorted(MD_TO_PDF_TEMPLATES.glob("*.css")):
        theme_id = css.stem
        out.append(
            Theme(id=theme_id, name=_HUMAN_NAMES.get(theme_id, theme_id.replace("-", " ").title()))
        )
    return out
