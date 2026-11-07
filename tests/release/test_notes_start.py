import pytest

from scripts.release.notes_start import main, previous_tag

TAGS = ["v0.2.0", "v0.2.0-beta.1", "v0.2.1", "v0.3.0-beta.1", "v0.3.0-beta.2", "not-a-tag"]


@pytest.mark.parametrize(
    ("tag", "expected"),
    [
        ("v0.3.0-beta.2", "v0.3.0-beta.1"),
        ("v0.3.0-beta.3", "v0.3.0-beta.2"),
        ("v0.3.0-rc.1", "v0.3.0-beta.2"),
        ("v0.4.0-beta.1", "v0.2.1"),
        ("v0.3.0", "v0.2.1"),
        ("v0.2.0", None),
        ("v0.2.1", "v0.2.0"),
    ],
)
def test_previous_tag(tag, expected):
    assert previous_tag(tag, TAGS) == expected


def test_ignores_the_tag_itself_and_later_tags():
    assert previous_tag("v0.3.0-beta.1", ["v0.3.0-beta.1", "v0.3.0-beta.2"]) is None


def test_invalid_tag_raises():
    with pytest.raises(ValueError):
        previous_tag("0.3.0", TAGS)


def test_main(monkeypatch, capsys):
    import io

    monkeypatch.setattr("sys.stdin", io.StringIO("v0.2.1\nv0.3.0-beta.1\n"))
    assert main(["notes_start.py", "v0.3.0-beta.2"]) == 0
    assert capsys.readouterr().out.strip() == "v0.3.0-beta.1"
    assert main(["notes_start.py"]) == 2
