# Contributing to md-bridge

Thanks for taking the time to look at this project. md-bridge stays small and
opinionated on purpose, but pull requests, bug reports, and ideas are welcome.
This guide explains how to file something useful and how to land a change.

## Quick links

- New to the code? Read the [README](README.md) first, especially the
  [Quickstart](README.md#quickstart) section.
- Architecture context lives in [`docs/`](docs/).
- Found something broken? File a [bug report](.github/ISSUE_TEMPLATE/bug_report.md).
- Have an idea? Open a [feature request](.github/ISSUE_TEMPLATE/feature_request.md)
  or start a thread in
  [Discussions](https://github.com/vinicq/md-bridge/discussions).

## Filing an issue

Before you open a new issue, please search existing issues to avoid duplicates.
If you do open one, the templates ask for the basics:

- For bugs: what you did, what you expected, what happened, and how to
  reproduce it. Logs and screenshots help a lot.
- For features: the problem first, then the proposed solution and any
  alternatives you have already considered.

Keep the title short and concrete. "PDF inspect endpoint returns 500 on tagged
files" is better than "bug in API".

## Submitting a pull request

The basic flow:

1. Fork the repo and create a topic branch off `main`.
2. Make your change with tests.
3. Run the full test pyramid locally (see below).
4. Open the PR using the provided template.
5. Address review feedback in follow-up commits. Squash on merge is fine.

Small, focused PRs ship faster than large ones. If a change is going to be
big, open an issue first so we can agree on the approach before you write the
code.

## Local setup

Follow the [Quickstart in the README](README.md#quickstart). In short:

- Python 3.12 or newer for the backend.
- Node 22 and npm 10 for the frontend.
- A one-time `python -m playwright install chromium` so the Markdown to PDF
  renderer can boot.

Once that is wired up, the root-level `npm run dev` brings the API on
`localhost:8000` and the Vite dev server on `localhost:5173`.

## Tests

md-bridge follows a strict test pyramid. Every pull request adds tests at the
lowest viable tier:

- **Unit tests** for pure functions, heuristics, and components.
  Backend: `pytest apps/api/tests`. Frontend: `npm run test:unit`.
- **Integration tests** for the FastAPI app and React routing wired
  together. Backend: `pytest tests`. Frontend: `npm run test:integration`.
- **End-to-end tests** with Playwright for full browser flows.
  Frontend: `npm run test:e2e`.

Pick the lowest tier that actually exercises the behavior. A heuristic that
parses a heading does not need a Playwright test; a button that triggers a
download does.

### What is allowed in tests

- Real implementations whenever possible. The PDF fixtures in
  `apps/api/tests/fixtures/` are committed for exactly this reason.
- Platform-level test doubles from the standard React Testing Library and
  Vitest toolkits: callback spies via `vi.fn()`, fake timers via
  `useFakeTimers`, and similar fixtures provided by the test framework.

### What is not allowed in tests

- Mocking business-layer modules. If a component calls a helper from
  `packages/`, the test should run that helper for real.
- Mocking `fetch`, the File API, or other browser APIs. Use a real
  request against the running app, or a real `File` object, or a Playwright
  test if the boundary really is the browser.
- Hand-rolled stand-ins for modules that already have a real implementation
  in the repo.

If you find yourself reaching for a heavy mock, that is usually a signal that
the test belongs one tier higher.

## Code style

### TypeScript and React

- `strict` mode is on in `tsconfig.json` and stays on. No `any`, no `// @ts-ignore`
  without a comment that explains why.
- Prefer function components and hooks. Keep components small.
- ESLint is the source of truth: `npm run lint` from `apps/web/` must pass.

### Python

- Target Python 3.12+ idioms: PEP 695 type parameters where they help,
  `match` statements when the alternative is a long `if/elif` chain,
  `pathlib.Path` over `os.path` strings.
- Type hints on public functions. `from __future__ import annotations` is
  fine but not required.
- `ruff` and `black` settings live in `apps/api/pyproject.toml`. Run them
  before opening a PR.

### Comments

Code should read top to bottom. Comments explain the non-obvious "why", not
the obvious "what". A comment that restates the next line is noise; a comment
that explains a workaround for a PyMuPDF quirk is useful.

## Commit messages

We follow the standard Git convention:

- Subject line in the imperative mood ("Add fallback for tagged PDFs", not
  "Added" or "Adds").
- 72 characters or fewer for the subject.
- Body wrapped at 80 columns, separated from the subject by a blank line.
- Explain the "why" in the body when the change is not self-evident.
- Reference issues with `Fixes #123` or `Refs #123` on a trailing line.

A good commit message looks like:

```
Drop pypdf fallback for outline parsing

PyMuPDF's get_toc() now handles every fixture we ship, and the pypdf
fallback added 200 ms to cold starts. Remove it and the dependency.

Fixes #142
```

## License and contributions

md-bridge is released under the [MIT License](LICENSE). By submitting a pull
request you agree that your contribution will be licensed under the same
terms. If you are contributing on behalf of a company, please make sure you
have permission to do so.

## Code of conduct

This project follows the [Contributor Covenant 2.1](CODE_OF_CONDUCT.md). Be
kind, assume good faith, and report any incident to the maintainer email
listed there. We want a healthy project, and that starts with how people
treat each other.

Welcome aboard, and thanks again for helping out.
