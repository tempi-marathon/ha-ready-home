"""Validate a release tag and classify it as stable or prerelease."""

from __future__ import annotations

import re
import sys

TAG_RE = re.compile(
    r"^v(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(-(beta|rc)\.[1-9][0-9]*)?$"
)
ACCEPTED = "vX.Y.Z, vX.Y.Z-beta.N or vX.Y.Z-rc.N (N >= 1, no leading zeros)"


def parse_tag(tag: str) -> dict[str, str]:
    """Return version, base, kind and latest for a valid tag, else raise ValueError."""
    match = TAG_RE.fullmatch(tag)
    if match is None:
        raise ValueError(f"Invalid tag {tag!r}; accepted formats: {ACCEPTED}")
    version = tag[1:]
    prerelease = match.group(4) is not None
    return {
        "version": version,
        "base": version.split("-", 1)[0],
        "kind": "prerelease" if prerelease else "stable",
        "latest": "false" if prerelease else "true",
    }


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: validate_tag.py <tag>", file=sys.stderr)
        return 2
    try:
        values = parse_tag(argv[1])
    except ValueError as err:
        print(f"::error::{err}", file=sys.stderr)
        return 1
    for key, value in values.items():
        print(f"{key}={value}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
