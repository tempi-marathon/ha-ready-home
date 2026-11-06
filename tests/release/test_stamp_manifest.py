from pathlib import Path

import pytest

from scripts.release.stamp_manifest import main, stamp

MANIFEST = Path(__file__).parents[2] / "custom_components" / "ready_home" / "manifest.json"


def changed_lines(before: str, after: str) -> list[int]:
    a, b = before.split("\n"), after.split("\n")
    assert len(a) == len(b)
    return [i for i, (x, y) in enumerate(zip(a, b, strict=True)) if x != y]


def test_changes_only_version_line():
    text = MANIFEST.read_text(encoding="utf-8")
    out = stamp(text, "9.9.9-beta.1")
    changed = changed_lines(text, out)
    assert len(changed) == 1
    assert '"version": "9.9.9-beta.1"' in out.split("\n")[changed[0]]
    assert out.endswith("\n") == text.endswith("\n")


def test_same_version_changes_nothing():
    text = MANIFEST.read_text(encoding="utf-8")
    current = text.split('"version": "')[1].split('"')[0]
    assert stamp(text, current) == text


@pytest.mark.parametrize("text", ['{"name": "x"}', '{"version": "1", "version": "2"}'])
def test_requires_exactly_one_version(text):
    with pytest.raises(ValueError, match="exactly one"):
        stamp(text, "1.0.0")


def test_main_writes_file(tmp_path):
    path = tmp_path / "manifest.json"
    path.write_text('{\n  "version": "0.0.1"\n}\n', encoding="utf-8")
    assert main(["stamp_manifest.py", str(path), "2.0.0"]) == 0
    assert path.read_text(encoding="utf-8") == '{\n  "version": "2.0.0"\n}\n'
    assert main(["stamp_manifest.py", str(path)]) == 2
