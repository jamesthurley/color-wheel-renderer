#!/usr/bin/env node
import * as program from 'commander';
import { populateColorWheelCommands } from './populate-color-wheel-commands';
import {version} from '../package.json';

process.on('warning', e => console.warn(e.stack));

program.version(version || '0.0.0', '--version');

populateColorWheelCommands(program);

// This fixes the arguments when debugging under e.g. VSCode.
const argv: string[] = process.argv.filter(v => v !== '--');

program.parse(argv);
