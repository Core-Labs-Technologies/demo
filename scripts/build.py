"""Build the deployable site.

site/index.html is the page body (it is also what gets published as the
claude.ai artifact). This wraps it into a complete HTML document at the repo
root, which is what Vercel serves. Media lives in clips/.

Usage: python3 scripts/build.py
"""
import pathlib

root = pathlib.Path(__file__).resolve().parent.parent
body = (root / "site" / "index.html").read_text()
head_end = body.index("</style>") + len("</style>")
page = (
    "<!doctype html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n"
    "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\">\n"
    + body[:head_end]
    + "\n</head>\n<body>\n"
    + body[head_end:]
    + "\n</body>\n</html>\n"
)
(root / "index.html").write_text(page)
print("wrote", root / "index.html")
