# Contributing to JabMap

Thank you for your interest in JabMap!
JabMap is part of the [JabRef](https://github.com/JabRef/jabref) family and follows its [contribution guidelines](https://github.com/JabRef/jabref/blob/main/CONTRIBUTING.md) where they apply.
We regard contributors as [software engineers, not just programmers](https://www.phoenix.edu/blog/programmer-vs-software-engineer-key-differences.html): for non-trivial issues, expect to work on the requirements side, too.

If you use an AI coding assistant, read our [AI usage policy](https://github.com/JabRef/jabref/blob/main/AI_USAGE_POLICY.md) and [AGENTS.md](AGENTS.md).
In short: AI may assist, but you submit the change, you understand it, and you answer for it.

## Table of contents

- [Choosing a task](#choosing-a-task)
- [Setting up a development environment](#setting-up-a-development-environment)
- [Running JabMap against JabRef](#running-jabmap-against-jabref)
- [Pull request process](#pull-request-process)
- [Building the desktop app](#building-the-desktop-app)
- [Architecture notes](#architecture-notes)

## Choosing a task

Pick an unassigned issue from the [issue tracker](https://github.com/JabRef/jabmap/issues).
Issues labeled [good first issue](https://github.com/JabRef/jabmap/labels/good%20first%20issue) are a good start.
Comment on the issue before starting so we can assign it to you and avoid duplicate work.

Many features need a change on both sides: JabMap (this repository) and JabRef's HTTP server (`jabsrv` in the [jabref](https://github.com/JabRef/jabref) repository).
If your task touches the server, open an issue or PR there as well and link the two.

## Setting up a development environment

You need [Node.js](https://nodejs.org/) 22 or newer (CI uses Node 22).
We recommend [nvm](https://github.com/nvm-sh/nvm) to manage Node versions:

```bash
nvm install 22
```

Then clone and install:

```bash
git clone git@github.com:JabRef/jabmap.git
cd jabmap
npm ci
```

`npm ci` installs exactly the versions pinned in `package-lock.json`, which is what CI does.
Use `npm install` only when you intentionally change dependencies.

Useful scripts:

| Command | What it does |
|---------|--------------|
| `npm run dev` | Vite dev server with hot reload, usually at <http://localhost:5173/> |
| `npm run build` | Production build into `dist/`. The only check CI runs. |
| `npm run preview` | Serve the production build at <http://localhost:4173/> |
| `npm run dev-desktop` | Run the Electron desktop app against the dev build |
| `npm run bundle` | Build Electron installers into `electron-dist/` |

There is no automated test suite and no linter yet. All behaviour is verified manually.

## Running JabMap against JabRef

Saving, loading, BibTeX nodes and PDF import talk to JabRef's HTTP server on `http://localhost:23119/`.
Without it, JabMap starts but those features fail.
You have three options; the first is the easiest.

### Option 1: JabRef GUI

1. Install the latest development build from <https://builds.jabref.org/main/>, or build JabRef from source.
2. Launch JabRef and open a library (or click "Create example library" and save it).
3. File > Preferences > check "HTTP Server".

### Option 2: Server only, from the JabRef repository

Useful once you already have a `.bib` file, since this mode cannot create a new library.

```bash
git clone --recurse-submodules https://github.com/JabRef/jabref.git
cd jabref
curl -L ggcmd.io > gg.cmd     # wrapper that fetches Java and jbang for you
sh ./gg.cmd jbang .jbang/JabSrvLauncher.java
```

Alternatively, `sh ./gg.cmd just run-jabsrv` does the same, and `sh ./gg.cmd just run-gui` starts the full JabRef GUI from source.

### Option 3: From an IDE

Open the jabref repository in your IDE (IntelliJ IDEA works well), locate `jabsrv/src/test/rest-api.http` and follow the steps at the top of that file.
Or run the `main()` method of `jabsrv-cli/src/main/java/org/jabref/http/server/cli/ServerCli.java`.

More in [JabRef's HTTP server documentation](https://devdocs.jabref.org/code-howtos/http-server.html).
`jabsrv/src/test/rest-api.http` doubles as the protocol reference: it lists every endpoint with example requests.

### Smoke test

With the server running and `npm run dev` started:

1. Open the Vite URL in the browser and open a library with the corresponding map.
2. Select the root node by clicking on it.
3. Press <kbd>Ctrl</kbd> + <kbd>B</kbd>.
4. Select any number of BibTeX entries from the library and press "Cite".

You should now see BibTeX nodes attached to the root node.

## Pull request process

We follow the [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow): branch from `main`, open a pull request, iterate on review, squash-merge.

Before opening a PR:

- `npm run build` passes.
- You tested the change manually against a running JabRef HTTP server and can say what you clicked.
- User-visible changes have an entry in [`CHANGELOG.md`](CHANGELOG.md) under `[Unreleased]`, following the existing wording ("We added ...", "We fixed ...").
- New or changed keyboard shortcuts are reflected in [`shortcuts.md`](shortcuts.md).
- No build output, `node_modules/` or `gg.cmd` is committed.

In the PR description, state the problem, the outcome, and how to test it: which JabRef setup, which clicks.
JabMap is a visual application, so attach a screenshot or short GIF for anything a user can see.
If the change needs a jabref-side change, link the jabref PR and keep the JabMap PR as a draft until the jabref one is merged and available in a development build.
`main` is deployed to GitHub Pages on every push, and users run it against the latest JabRef development build, so the server side always lands first.

After you open the PR:

- CI builds the project and checks `CHANGELOG.md` formatting with [heylogs](https://github.com/nbbrd/heylogs).
- [Qodo](https://www.qodo.ai/) reviews every PR automatically and posts suggestions. Go through them: apply what helps, and reply briefly where a suggestion does not fit. Do not accept suggestions you do not understand.
- A maintainer reviews afterwards. Respond to comments yourself; we want to talk to you, not to your tooling.
- Keep the PR focused. Unrelated clean-ups belong in a separate PR.

## Building the desktop app

JabMap can be wrapped as an Electron app.
This is optional for development; the browser build is what users get on GitHub Pages.

```bash
npm ci
npm run bundle
```

This writes installers and an unpacked app into `electron-dist/`, for example `electron-dist/win-unpacked/JabMap.exe` or `electron-dist/JabMap Setup <version>.exe` on Windows.

Known issues:

- **Windows: `ERROR: Cannot create symbolic link`** during bundling. Download [winCodeSign-2.6.0.7z](https://github.com/electron-userland/electron-builder-binaries/releases/download/winCodeSign-2.6.0/winCodeSign-2.6.0.7z), extract it into `C:\Users\<YourUserName>\AppData\Local\electron-builder\Cache\winCodeSign\winCodeSign-2.6.0\` and retry. See [electron-builder issue 8149](https://github.com/electron-userland/electron-builder/issues/8149).
- **Linux and macOS: npm optional dependency bug** after `npm install` ([npm issue 4828](https://github.com/npm/cli/issues/4828)). Remove `package-lock.json` and `node_modules/`, run `npm install` again, then retry.

## Architecture notes

- Plain JavaScript ES modules with [Bootstrap 5](https://getbootstrap.com/); no framework, no TypeScript.
- `src/main.js` is the entry point and wires the UI, `http/HTTPClient.js` is the only place that talks to JabRef.
- `src/jsmind/` is a vendored and modified copy of [jsMind](https://github.com/hizzgdev/jsmind), not a submodule. Keep changes there small so it stays diffable against upstream.
- Maps are stored as `.jmp` files next to the `.bib` file, read and written through JabRef's `libraries/{id}/map` endpoint.
