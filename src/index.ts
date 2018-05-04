#!/usr/bin/env node
import * as program from 'commander';
import { populateSessionCommands } from './populate-session-commands';
import { populateColorWheelCommands } from './populate-color-wheel-commands';
import {version} from '../package.json';

program.version(version || '0.0.0', '--version');

populateSessionCommands(program);
populateColorWheelCommands(program);

// This fixes the arguments when debugging under e.g. VSCode.
const argv: string[] = process.argv.filter(v => v !== '--');

program.parse(argv);
