import test, { Macro } from 'ava';
import { IntegrationTestConsumerHelper } from '../src/sessions/testing/integration-test-consumer-helper';
import { evaluateComparisons } from './evaluate-comparisons';
import { setTestLogLevel } from './set-test-log-level';
import { ColorWheelOptions } from '../src/commands/color-wheel-commands/color-wheel-options';
import { RenderColorWheelCommand } from '../src/commands/color-wheel-commands/render-color-wheel-command';
import { ColorWheelSetRenderer } from '../src/color-wheels/color-wheel-set-renderer';
import { ColorWheelRenderer } from '../src/color-wheels/color-wheel-renderer';
import { ComparingColorWheelConsumer } from '../src/color-wheels/color-wheel-consumers/comparing-color-wheel-consumer';
import { ColorWheelType } from '../src/commands/color-wheel-commands/color-wheel-type';
import { getTestLogLevel } from './get-test-log-level';

const macro: Macro = async (t, options: ColorWheelOptions) => {
  setTestLogLevel();

  options = ColorWheelOptions.create(
    {
      ...options,
      outputFile: './integration-tests/input-data/color-wheels/' + options.outputFile,
    });

  const comparisonHelper = new IntegrationTestConsumerHelper();
  const colorWheelRenderer = new RenderColorWheelCommand(
    options,
    new ColorWheelSetRenderer(new ColorWheelRenderer()),
    new ComparingColorWheelConsumer(comparisonHelper));

  await colorWheelRenderer.execute();

  await evaluateComparisons(t, comparisonHelper);
};

macro.title = (providedTitle: string, options: ColorWheelOptions) => `Integration Test: Color Wheel Rendering: ${options.outputFile}`.trim();

// odr color-wheel hsv-fixed-value -f 1 -f 0.6 -f 0.2 -a 18 -r 12 -d 720 -m 40 -o color-wheel-hsv-fixed-value-three.png
test(macro, new ColorWheelOptions(
  ColorWheelType.HsvFixedValue,
  getTestLogLevel(),
  'color-wheel-hsv-fixed-value-three.png',
  720,
  40,
  false,
  false,
  false,
  18,
  12,
  [ 1, 0.6, 0.2 ]));

// odr color-wheel hsl-fixed-lightness -f 0.8 -f 0.5 -f 0.2 -a 18 -r 12 -d 720 -m 40 -o color-wheel-hsl-fixed-lightness-three.png
test(macro, new ColorWheelOptions(
  ColorWheelType.HslFixedLightness,
  getTestLogLevel(),
  'color-wheel-hsl-fixed-lightness-three.png',
  720,
  40,
  false,
  false,
  false,
  18,
  12,
  [ 0.8, 0.5, 0.2 ]));

// odr color-wheel hsv-fixed-saturation -f 1 -f 0.6 -f 0.2 -a 18 -r 12 -d 720 -m 40 -o color-wheel-hsv-fixed-saturation-three.png
test(macro, new ColorWheelOptions(
  ColorWheelType.HsvFixedSaturation,
  getTestLogLevel(),
  'color-wheel-hsv-fixed-saturation-three.png',
  720,
  40,
  false,
  false,
  false,
  18,
  12,
  [ 1, 0.6, 0.2 ]));

// odr color-wheel hsl-fixed-saturation -f 1 -f 0.6 -f 0.2 -a 18 -r 12 -d 780 -m 10 -o color-wheel-hsl-fixed-saturation-three.png
test(macro, new ColorWheelOptions(
  ColorWheelType.HslFixedSaturation,
  getTestLogLevel(),
  'color-wheel-hsl-fixed-saturation-three.png',
  780,
  10,
  false,
  false,
  false,
  18,
  12,
  [ 1, 0.6, 0.2 ]));

// odr color-wheel hsl-fixed-saturation -d 720 -m 40 -o color-wheel-hsl-fixed-saturation-smooth.png
test(macro, new ColorWheelOptions(
  ColorWheelType.HslFixedSaturation,
  getTestLogLevel(),
  'color-wheel-hsl-fixed-saturation-smooth.png',
  720,
  40,
  false,
  false,
  false,
  0,
  0,
  [ 1 ]));

// odr color-wheel hsl-fixed-saturation -c -d 720 -m 40 -o color-wheel-hsl-fixed-saturation-smooth-reversed-colors.png
test(macro, new ColorWheelOptions(
  ColorWheelType.HslFixedSaturation,
  getTestLogLevel(),
  'color-wheel-hsl-fixed-saturation-smooth-reversed-colors.png',
  720,
  40,
  false,
  true,
  false,
  0,
  0,
  [ 1 ]));

// odr color-wheel hsl-fixed-saturation -a 36 -d 720 -m 40 -o color-wheel-hsl-fixed-saturation-angular.png
test(macro, new ColorWheelOptions(
  ColorWheelType.HslFixedSaturation,
  getTestLogLevel(),
  'color-wheel-hsl-fixed-saturation-angular.png',
  720,
  40,
  false,
  false,
  false,
  36,
  0,
  [ 1 ]));

// odr color-wheel hsl-fixed-saturation -r 12 -d 780 -m 10 -o color-wheel-hsl-fixed-saturation-radial.png
test(macro, new ColorWheelOptions(
  ColorWheelType.HslFixedSaturation,
  getTestLogLevel(),
  'color-wheel-hsl-fixed-saturation-radial.png',
  780,
  10,
  false,
  false,
  false,
  0,
  12,
  [ 1 ]));

// odr color-wheel hsv-fixed-saturation -f 0.25 -f 0.5 -f 1 -a 18 -r 12 -e -d 720 -m 40 -o color-wheel-hsv-fixed-saturation-expand.png
test(macro, new ColorWheelOptions(
  ColorWheelType.HsvFixedSaturation,
  getTestLogLevel(),
  'color-wheel-hsv-fixed-saturation-expand.png',
  720,
  40,
  true,
  false,
  false,
  18,
  12,
  [ 0.25, 0.5, 1 ]));

// odr color-wheel hsl-fixed-saturation -f 0.1 -f 0.5 -f 1 -a 18 -r 12 -e -b -d 720 -m 40 -o color-wheel-hsl-fixed-saturation-expand.png
test(macro, new ColorWheelOptions(
  ColorWheelType.HslFixedSaturation,
  getTestLogLevel(),
  'color-wheel-hsl-fixed-saturation-expand.png',
  720,
  40,
  true,
  false,
  true,
  18,
  12,
  [ 0.1, 0.5, 1 ]));

// odr color-wheel hsv-fixed-saturation -a 12 -r 5 -d 720 -m 40 -o color-wheel-hsv-fixed-saturation-coarse.png
test(macro, new ColorWheelOptions(
  ColorWheelType.HsvFixedSaturation,
  getTestLogLevel(),
  'color-wheel-hsv-fixed-saturation-coarse.png',
  720,
  40,
  false,
  false,
  false,
  12,
  5,
  [ 1 ]));
