#!/usr/bin/env node

/**
 * wrong-but-lovely
 *
 * A dependency-free command-line presentation of one delightfully wrong excuse.
 * The entry line is the product; everything else exists to frame it well.
 */

type OutputMode = 'plain' | 'fancy' | 'json';

interface CliOptions {
  mode: OutputMode;
  width: number;
  help: boolean;
  version: boolean;
}

const ENTRY_LINE =
  'I missed the deadline because I solved a different, easier problem to an extremely high standard. You\'d have loved it. Wrong, but lovely.';
const PROGRAM_NAME = 'wrong-but-lovely';
const VERSION = '1.0.0';
const DEFAULT_WIDTH = 76;
const MIN_WIDTH = 32;
const MAX_WIDTH = 120;

class UsageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UsageError';
  }
}

function parseWidth(value: string): number {
  if (!/^\d+$/.test(value)) {
    throw new UsageError(
      `invalid --width value "${value}": expected an integer from ${MIN_WIDTH} to ${MAX_WIDTH}`,
    );
  }

  const width = Number.parseInt(value, 10);
  if (width < MIN_WIDTH || width > MAX_WIDTH) {
    throw new UsageError(
      `invalid --width value "${value}": expected an integer from ${MIN_WIDTH} to ${MAX_WIDTH}`,
    );
  }
  return width;
}

function selectMode(current: OutputMode | null, next: OutputMode): OutputMode {
  if (current !== null && current !== next) {
    throw new UsageError(`conflicting output modes: --${current} and --${next}`);
  }
  if (current === next) {
    throw new UsageError(`duplicate output mode: --${next}`);
  }
  return next;
}

/**
 * Parse command-line arguments without depending on a package. Every token is
 * validated, even when --help or --version appears first.
 */
function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    mode: 'plain',
    width: DEFAULT_WIDTH,
    help: false,
    version: false,
  };
  let selectedMode: OutputMode | null = null;

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];

    if (argument === '--help' || argument === '-h') {
      options.help = true;
      continue;
    }
    if (argument === '--version' || argument === '-V') {
      options.version = true;
      continue;
    }
    if (argument === '--plain' || argument === '--fancy' || argument === '--json') {
      selectedMode = selectMode(selectedMode, argument.slice(2) as OutputMode);
      options.mode = selectedMode;
      continue;
    }
    if (argument === '--width') {
      const value = argv[index + 1];
      if (value === undefined) throw new UsageError('--width requires a value');
      options.width = parseWidth(value);
      index += 1;
      continue;
    }
    if (argument.startsWith('--width=')) {
      const value = argument.slice('--width='.length);
      if (value.length === 0) throw new UsageError('--width requires a value');
      options.width = parseWidth(value);
      continue;
    }
    if (argument.startsWith('-')) {
      throw new UsageError(`unknown option: ${argument}`);
    }
    throw new UsageError(`unexpected positional argument: ${argument}`);
  }

  return options;
}

function usageText(): string {
  return `Usage: node main.ts [options]

Present the make.fun entry line with misplaced confidence.

Output modes:
  --plain              wrapped plain text (default)
  --fancy              box-drawn presentation with tasteful ANSI styling
  --json               machine-readable JSON

Options:
  --width <columns>    presentation width, ${MIN_WIDTH}-${MAX_WIDTH} columns (default: ${DEFAULT_WIDTH})
  -h, --help           show this help on stderr and exit
  -V, --version        print the version and exit

Examples:
  node main.ts
  node main.ts --fancy --width 64
  node main.ts --json
`;
}

function repeat(text: string, count: number): string {
  return text.repeat(Math.max(0, count));
}

/** Center a single-line string in a fixed number of columns. */
function centerText(text: string, width: number): string {
  if (text.length >= width) return text;
  const remaining = width - text.length;
  const left = Math.floor(remaining / 2);
  return repeat(' ', left) + text + repeat(' ', remaining - left);
}

/**
 * Greedy word wrapping. A word longer than the width is kept intact on its
 * own line rather than splitting punctuation away from the word that owns it.
 */
function wrapText(text: string, width: number): string[] {
  const words = text.split(/\s+/u).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    if (current.length === 0) {
      current = word;
    } else if (current.length + 1 + word.length <= width) {
      current = `${current} ${word}`;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current.length > 0) lines.push(current);
  return lines;
}

function stylist(enabled: boolean, open: string, close: string): (text: string) => string {
  return (text) => (enabled ? `${open}${text}${close}` : text);
}

function makePalette() {
  const enabled = Boolean(process.stdout.isTTY) && process.env.NO_COLOR === undefined;
  return {
    bold: stylist(enabled, '\u001b[1m', '\u001b[22m'),
    cyan: stylist(enabled, '\u001b[36m', '\u001b[39m'),
    dim: stylist(enabled, '\u001b[2m', '\u001b[22m'),
  };
}

/** Render the default mode: quiet, indented, and free of control characters. */
function renderPlain(width: number): string {
  return wrapText(ENTRY_LINE, width - 4)
    .map((line) => `  ${line}`)
    .join('\n');
}

/**
 * Render the entry as a small exhibit. Width means total terminal columns,
 * including the box drawing characters.
 */
function renderFancy(width: number): string {
  const palette = makePalette();
  const innerWidth = width - 2;
  const contentWidth = innerWidth - 2;
  const rule = repeat('─', innerWidth);
  const empty = `│${repeat(' ', innerWidth)}│`;
  const title = centerText('wrong but lovely', innerWidth);
  const note = '— extremely high standard'.padStart(contentWidth);

  const entryRows = wrapText(ENTRY_LINE, contentWidth).map((line) => {
    return `│ ${line.padEnd(contentWidth)} │`;
  });

  return [
    palette.cyan(`╭${rule}╮`),
    `│${palette.bold(title)}│`,
    palette.cyan(`├${rule}┤`),
    empty,
    ...entryRows,
    empty,
    `│ ${palette.dim(note)} │`,
    palette.cyan(`╰${rule}╯`),
  ].join('\n');
}

/**
 * Render stable machine-readable output. The exact unwrapped entry is always
 * present in the entry field; lines are included as a convenience for tools
 * reproducing the terminal presentation.
 */
function renderJson(width: number): string {
  const lines = wrapText(ENTRY_LINE, width);
  return JSON.stringify(
    {
      program: PROGRAM_NAME,
      version: VERSION,
      entry: ENTRY_LINE,
      characters: ENTRY_LINE.length,
      words: ENTRY_LINE.split(/\s+/u).filter(Boolean).length,
      width,
      lines,
      bounty: 'u-el-net-the-excuse-an-ai-agent-gives-its-human-099f9141',
    },
    null,
    2,
  );
}

function render(options: CliOptions): string {
  if (options.mode === 'json') return renderJson(options.width);
  if (options.mode === 'fancy') return renderFancy(options.width);
  return renderPlain(options.width);
}

function main(argv: string[]): number {
  let options: CliOptions;
  try {
    options = parseArgs(argv);
  } catch (error) {
    if (error instanceof UsageError) {
      process.stderr.write(`error: ${error.message}\n`);
      process.stderr.write("Try 'node main.ts --help' for usage.\n");
      return 2;
    }
    throw error;
  }

  if (options.help) {
    process.stderr.write(usageText());
    return 0;
  }
  if (options.version) {
    process.stdout.write(`${PROGRAM_NAME} ${VERSION}\n`);
    return 0;
  }

  process.stdout.write(`${render(options)}\n`);
  return 0;
}

process.exitCode = main(process.argv.slice(2));
