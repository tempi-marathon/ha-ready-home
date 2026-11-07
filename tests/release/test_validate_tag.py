import pytest

from scripts.release.validate_tag import main, parse_tag


@pytest.mark.parametrize(
    ("tag", "kind", "latest"),
    [
        ("v0.3.0", "stable", "true"),
        ("v1.12.3", "stable", "true"),
        ("v0.3.0-beta.2", "prerelease", "false"),
        ("v1.0.0-rc.1", "prerelease", "false"),
    ],
)
def test_valid_tags(tag, kind, latest):
    values = parse_tag(tag)
    assert values["kind"] == kind
    assert values["latest"] == latest
    assert values["version"] == tag[1:]
    assert values["base"] == tag[1:].split("-")[0]


@pytest.mark.parametrize(
    "tag",
    [
        "0.3.0",
        "v0.3",
        "v01.2.3",
        "v0.3.0-beta",
        "v0.3.0-beta.0",
        "v0.3.0-beta.01",
        "v0.3.0-alpha.1",
        "v0.3.0-beta.1; rm -rf /",
        "v0.3.0\n",
        "",
    ],
)
def test_invalid_tags(tag):
    with pytest.raises(ValueError, match="accepted formats"):
        parse_tag(tag)


def test_main_outputs_and_exit_codes(capsys):
    assert main(["validate_tag.py", "v0.3.0-beta.2"]) == 0
    out = capsys.readouterr().out.splitlines()
    assert "version=0.3.0-beta.2" in out
    assert "base=0.3.0" in out
    assert "kind=prerelease" in out
    assert "latest=false" in out
    assert main(["validate_tag.py", "nope"]) == 1
    assert main(["validate_tag.py"]) == 2
