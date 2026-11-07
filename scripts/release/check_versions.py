"""Require manifest.json, pyproject.toml and package.json to agree on the release base version."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

PYPROJECT_RE = re.compile(r'^version\s*=\s*"([^"]*)"', re.MULTILINE)


def read_versions(root: Path) -> dict[str, str]:
    """Return the committed version from each of the three files under root."""
    manifest = json.loads((root / "custom_components/ready_home/manifest.json").read_text("utf-8"))
    package = json.loads((root / "package.json").read_text("utf-8"))
    match = PYPROJECT_RE.search((root / "pyproject.toml").read_text("utf-8"))
    return {
        "manifest.json": manifest["version"],
        "pyproject.toml": match.group(1) if match else "<missing>",
        "package.json": package["version"],
    }


def check(versions: dict[str, str], base: str) -> list[str]:
    """Return one message per file whose version differs from base."""
    return [
        f"{name} is {found}, expected {base}" for name, found in versions.items() if found != base
    ]


def main(argv: list[str]) -> int:
    if len(argv) != 3:
        print("usage: check_versions.py <repo root> <base version>", file=sys.stderr)
        return 2
    versions = read_versions(Path(argv[1]))
    problems = check(versions, argv[2])
    for name, found in versions.items():
        print(f"{name}: {found}")
    if problems:
        print(
            "::error::Committed versions must all equal the release base version; "
            "bump them in a PR first. " + "; ".join(problems),
            file=sys.stderr,
        )
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
