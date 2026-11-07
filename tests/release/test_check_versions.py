import json
from pathlib import Path

from scripts.release.check_versions import check, main, read_versions

REPO = Path(__file__).parents[2]


def make_repo(tmp_path, manifest="0.3.0", pyproject="0.3.0", package="0.3.0"):
    (tmp_path / "custom_components/ready_home").mkdir(parents=True)
    (tmp_path / "custom_components/ready_home/manifest.json").write_text(
        json.dumps({"version": manifest}), encoding="utf-8"
    )
    (tmp_path / "pyproject.toml").write_text(
        f'[project]\nname = "x"\nversion = "{pyproject}"\n', encoding="utf-8"
    )
    (tmp_path / "package.json").write_text(json.dumps({"version": package}), encoding="utf-8")
    return tmp_path


def test_repo_versions_agree_with_each_other():
    assert len(set(read_versions(REPO).values())) == 1


def test_all_equal_passes(tmp_path):
    assert main(["c", str(make_repo(tmp_path)), "0.3.0"]) == 0


def test_mismatch_fails_and_names_files(tmp_path, capsys):
    root = make_repo(tmp_path, package="0.2.0")
    assert main(["c", str(root), "0.3.0"]) == 1
    err = capsys.readouterr().err
    assert "package.json is 0.2.0" in err
    assert "manifest.json is" not in err


def test_check_lists_each_difference():
    versions = {"manifest.json": "1", "pyproject.toml": "2", "package.json": "1"}
    assert check(versions, "1") == ["pyproject.toml is 2, expected 1"]


def test_usage(capsys):
    assert main(["c"]) == 2
