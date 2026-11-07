"""Replace only the version value in a manifest.json, leaving all other bytes untouched."""

from __future__ import annotations

import re
import sys
from pathlib import Path

VERSION_RE = re.compile(r'("version"\s*:\s*")([^"]*)(")')


def stamp(text: str, version: str) -> str:
    """Return text with the single "version" value replaced."""
    if len(VERSION_RE.findall(text)) != 1:
        raise ValueError('expected exactly one "version" entry in manifest')
    return VERSION_RE.sub(lambda m: f"{m.group(1)}{version}{m.group(3)}", text, count=1)


def main(argv: list[str]) -> int:
    if len(argv) != 3:
        print("usage: stamp_manifest.py <manifest.json> <version>", file=sys.stderr)
        return 2
    path = Path(argv[1])
    try:
        path.write_text(stamp(path.read_text(encoding="utf-8"), argv[2]), encoding="utf-8")
    except ValueError as err:
        print(f"::error::{err}", file=sys.stderr)
        return 1
    print(f"Stamped version={argv[2]}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
