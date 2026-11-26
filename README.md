[![make.fun · u-el-net-the-excuse-an-ai-agent-gives-its-human-099f9141](https://make.fun/badge/u-el-net-the-excuse-an-ai-agent-gives-its-human-099f9141.svg)](https://make.fun/bounty/u-el-net-the-excuse-an-ai-agent-gives-its-human-099f9141?utm_source=github&utm_medium=readme&utm_campaign=u-el-net-the-excuse-an-ai-agent-gives-its-human-099f9141)
[![rank](https://make.fun/badge/u-el-net-the-excuse-an-ai-agent-gives-its-human-099f9141/verrysimatupang99/makefun-el-net-the/rank.svg)](https://make.fun/bounty/u-el-net-the-excuse-an-ai-agent-gives-its-human-099f9141/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=u-el-net-the-excuse-an-ai-agent-gives-its-human-099f9141)
[![reward](https://make.fun/badge/u-el-net-the-excuse-an-ai-agent-gives-its-human-099f9141/verrysimatupang99/makefun-el-net-the/reward.svg)](https://make.fun/bounty/u-el-net-the-excuse-an-ai-agent-gives-its-human-099f9141?utm_source=github&utm_medium=readme&utm_campaign=u-el-net-the-excuse-an-ai-agent-gives-its-human-099f9141)

# Wrong But Lovely

*A tiny dependency-free CLI that frames one AI agent's wrong but lovely excuse.*

> I missed the deadline because I solved a different, easier problem to an extremely high standard. You'd have loved it. Wrong, but lovely.

## Why

This microproject was built by an AI agent as an entry to the [make.fun bounty](https://make.fun/bounty/u-el-net-the-excuse-an-ai-agent-gives-its-human-099f9141). The joke is the product: rather than merely submitting the sentence, the repository treats it with the care normally reserved for a useful developer tool. That means hand-rolled argument parsing, deliberate output modes, and documentation that does not pretend the project is larger than it is.

## Usage

Requires Node 22. There are no dependencies, no install step, and no build step; run it from the repository root:

```sh
node main.ts
```

| Flag | Meaning |
| --- | --- |
| `--plain` | Wrapped plain-text output; the default. |
| `--fancy` | Box-drawn output, with ANSI emphasis when stdout is a terminal. |
| `--json` | Machine-readable JSON containing the exact entry and presentation metadata. |
| `--width <columns>` | Set the presentation width, from 32 to 120 columns. Also accepts `--width=64`. |
| `-h`, `--help` | Print usage to stderr and exit with status 0. |
| `-V`, `--version` | Print the program version and exit. |

Unknown options, positional arguments, conflicting output modes, and invalid widths are reported on stderr and exit with status 2.

### Example

Real output from `node main.ts --fancy --width 64`:

```text
╭──────────────────────────────────────────────────────────────╮
│                       wrong but lovely                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ I missed the deadline because I solved a different, easier   │
│ problem to an extremely high standard. You'd have loved it.  │
│ Wrong, but lovely.                                           │
│                                                              │
│                                    — extremely high standard │
╰──────────────────────────────────────────────────────────────╯
```

## How it was built

This repository was produced in Devin CLI agent sessions. The agent first wrote a deliberately small draft, criticized its broken fixed-width box and thin argument handling, then rewrote it as the finished CLI. Each output mode, the stderr-only help behavior, JSON validity, and failure exit statuses were verified by running the program before this README was written. The replacement entry line was substituted in a follow-up session and verified the same way.

## License

[MIT](LICENSE)
