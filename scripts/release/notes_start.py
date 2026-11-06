"""Pick the previous tag that release notes should start from."""

from __future__ import annotations

import re
import sys

TAG_RE = re.compile(r"^v(\d+)\.(\d+)\.(\d+)(?:-(beta|rc)\.(\d+))?$")
RANK = {"beta": 0, "rc": 1, None: 2}


def _key(tag: str) -> tuple[int, int, int, int, int] | None:
    match = TAG_RE.fullmatch(tag)
    if match is None:
        return None
    major, minor, patch, stage, number = match.groups()
    return (int(major), int(minor), int(patch), RANK[stage], int(number or 0))


def previous_tag(tag: str, existing: list[str]) -> str | None:
    """Previous prerelease of the same X.Y.Z line, else the previous stable tag.

    A stable tag always starts from the previous stable tag.
    """
    current = _key(tag)
    if current is None:
        raise ValueError(f"Invalid tag {tag!r}")
    earlier = [(k, t) for t in existing if (k := _key(t)) is not None and k < current]
    if current[3] != RANK[None]:
        same_line = [(k, t) for k, t in earlier if k[:3] == current[:3]]
        if same_line:
            return max(same_line)[1]
    stable = [(k, t) for k, t in earlier if k[3] == RANK[None]]
    return max(stable)[1] if stable else None


def main(argv: list[str]) -> int:
    """Usage: notes_start.py <tag>; existing tags are read from stdin, one per line."""
    if len(argv) != 2:
        print("usage: notes_start.py <tag> < tags", file=sys.stderr)
        return 2
    try:
        found = previous_tag(argv[1], sys.stdin.read().split())
    except ValueError as err:
        print(f"::error::{err}", file=sys.stderr)
        return 1
    print(found or "")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
