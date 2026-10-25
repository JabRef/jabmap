# AGENTS.md — JabMap

Instructions for AI coding assistants and other automated agents working in this repository.
Humans: read [CONTRIBUTING.md](CONTRIBUTING.md) first; this file is referenced from there.

> [!IMPORTANT]
> JabMap follows JabRef's [AI usage policy](https://github.com/JabRef/jabref/blob/main/AI_USAGE_POLICY.md):
> AI tools may assist, but every change is submitted by a human who understands it and takes responsibility for it.
> Fully AI-generated pull requests are not accepted.

## What JabMap is

JabMap is JabRef's scientific mind-mapping web app, inspired by Docear.
It is a pure client of JabRef's HTTP server (`jabsrv`, `http://localhost:23119/`): saving, loading, BibTeX nodes and PDF import all go through `http/HTTPClient.js`.
The server side of every feature lives in the [jabref](https://github.com/JabRef/jabref) repository (`jabsrv/src/main/java/org/jabref/http/server/resources/`).

- Plain JavaScript ES modules, no framework, no TypeScript. Bootstrap 5 for UI.
- Built with Vite; optionally wrapped as an Electron desktop app (`src/electron/`).
- `src/jsmind/` is a vendored, modified copy of [jsMind](https://github.com/hizzgdev/jsmind). It is not a submodule and not an npm dependency. Keep changes there minimal and clearly separated from the rest.
- GitHub Pages serves the current `main` to end users. Whatever is merged is live within minutes.

Key files:

| Path | Purpose |
|------|---------|
| `src/main.js` | App entry point, UI wiring, keyboard shortcuts |
| `http/HTTPClient.js` | All communication with JabRef's HTTP server |
| `src/ActionStack.js` | Undo/redo |
| `src/modals/` | Bootstrap modal dialogs |
| `src/mindPresets/` | Default maps, jsMind options, node type extensions |
| `shortcuts.md` | User-facing shortcut list; update it when shortcuts change |
| `CHANGELOG.md` | Keep a Changelog format, checked by heylogs in CI |

## Build and verify

```bash
npm ci            # install exactly what package-lock.json pins (CI uses ci, not install)
npm run build     # vite build — the only check CI runs; must succeed
npm run dev       # Vite dev server for manual testing in the browser
npm run dev-desktop  # Electron; needs a display
```

There is no test suite and no linter.
Verify behaviour manually against a running JabRef HTTP server (see [CONTRIBUTING.md](CONTRIBUTING.md#running-jabmap-against-jabref)).
Say explicitly in the PR what you tested and how; do not claim a change works if you could not run it.

## Rules for agents

Agents **must**:

- Read the code a change touches, including its callers, before editing. Fix root causes, not symptoms.
- Keep changes minimal and reviewable: one concern per PR, no drive-by refactoring, no reformatting of untouched code.
- Match the existing style: ES modules, `camelCase`, `const`/`let`, semicolons, four-space indentation, single quotes for imports.
- Preserve compatibility with older JabRef builds. A JabMap change that needs a new or changed server endpoint must not merge before the jabref PR is merged and in a development build. Cross-reference both PRs and keep the JabMap one as a draft until then.
- Treat anything coming from the HTTP server, a `.jmp` file or the clipboard as untrusted input.
- Add a `CHANGELOG.md` entry under `[Unreleased]` for user-visible changes, in the existing "We added/changed/fixed ..." phrasing.
- Update `shortcuts.md` when adding or changing keyboard shortcuts.
- Run `npm run build` before declaring the work done.

Agents **must not**:

- Add dependencies without justification. Prefer the platform (DOM, `fetch`, CSS) and what is already installed (Bootstrap, jsMind).
- Rewrite or "clean up" `src/jsmind/`; it is third-party code and must stay diffable against upstream.
- Change the hard-coded server URL, ports or the `.jmp` format without a matching jabref change.
- Commit build output (`dist/`, `electron-dist/`), `node_modules/` or `gg.cmd`.
- Write replies to review comments on behalf of the contributor.

## Code quality

- Explain non-obvious *why* in comments, never *what* the line does, and never the task that prompted the change.
- Reference issues and PRs in code comments by full URL, never by bare `#123`.
- Keep functions small and single-purpose. No speculative abstractions, no configuration for values that never change.
- Handle errors where data could be lost: a failed save must be visible to the user, never silently swallowed.
- Keep the UI keyboard-accessible; every new action reachable with the mouse should have a shortcut or be reachable by Tab.

## Pull requests

- Title: imperative, under 70 characters, e.g. "Add PDF import for selected node".
- Description: the problem and the outcome in a few sentences, and how to test it (which JabRef setup, which clicks). No file lists, no implementation narration.
- Attach a screenshot or short GIF for any user-visible change. JabMap is a visual app.
- Reviews come from two sources: [Qodo](https://www.qodo.ai/) comments on every PR automatically, and a maintainer reviews afterwards. Address Qodo's findings, or state in the PR why a suggestion does not apply; do not blindly accept its suggestions.
- Do not submit a PR the contributor cannot explain line by line.
