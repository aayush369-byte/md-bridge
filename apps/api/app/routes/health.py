"""Liveness probe."""
from __future__ import annotations

from fastapi import APIRouter

from app import __version__

router = APIRouter(tags=["health"])


@router.get(
    "/api/health",
    summary="Service liveness",
    description=(
        "Returns `{status: 'ok', version: <semver>}` when the API is up.\n\n"
        "Use this for container/orchestrator health checks. Always responds in "
        "single-digit milliseconds."
    ),
    response_description="Service is alive and reports its semantic version.",
    responses={
        200: {
            "content": {
                "application/json": {
                    "example": {"status": "ok", "version": "0.1.0"},
                },
            },
        },
    },
)
async def health() -> dict[str, str]:
    return {"status": "ok", "version": __version__}
