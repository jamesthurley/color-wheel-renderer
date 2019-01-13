# Color Wheel Renderer

[![Build Status](https://travis-ci.org/jamesthurley/color-wheel-renderer.svg?branch=master)](https://travis-ci.org/jamesthurley/color-wheel-renderer)

If you have any problems or suggestions for new features please let me know in an [issue](https://github.com/jamesthurley/color-wheel-renderer/issues).

## Installation

```
npm install -g color-wheel-renderer
```

## License

Color Wheel Renderer is released under the MIT License. See [LICENSE][1] file for details.

[1]: https://github.com/jamesthurley/color-wheel-renderer/master/LICENSE


# Usage

Each color wheel represents a mapping from the **(3D HSL or HSV cylinder)[https://en.wikipedia.org/wiki/HSL_and_HSV]** to a 2D circle. However this is not limited to a simple slice through the cylinder.

There are four base types of color wheel, two for HSL and two for HSV cylinders. For HSL there is either a fixed **lightness** or fixed **saturation**, and for HSV there is either a fixed **value** or fixed **saturation**.

In either case, you can specify one or more values for of the fixed variable.
Each fixed value will create a new color wheel, or if the `--expand` option is used it will expand a single
color wheel using each value in turn.

You can **bucket** in either the angular or radial directions using the `--angular-buckets` and `--radial-buckets` options.  

You can reverse the colors in the radial direction using the `--reverse-radial-colors` option.
This option also automatically reverses the radial bucketing direction from outwards to inwards, however you can also 
independently reverse the radial bucketing direction with the `--reverse-radial-bucketing` option.

You can set the diameter of each wheel in pixels using the `--diameter` option, and add a margin using the `--margin` option.


```
> color-wheel-renderer color-wheel --help

Usage: color-wheel [options] <type>

  Renders one or more color wheels. Type can be one of [hsl-fixed-saturation, hsl-fixed-lightness, hsv-fixed-saturation, hsv-fixed-value].

  Options:

    -a --angular-buckets <count>   Number of angular buckets to divide colors into. Defaults to 0, which gives a smooth output.
    -r --radial-buckets <count>    Number of radial buckets to divide colors into. Defaults to 0, which gives a smooth output.
    -f --fixed <number>            Fixed values at which to render. Can be specified multiple times. Defaults to 0.5 for lightness or 1 for saturation and value. (default: )
    -o --output <filePath>         Path to file where color wheel should be saved.
    -d --diameter <pixels>         Diameter of the color wheel in pixels.
    -m --margin <pixels>           Size of margin around color wheel in pixels.
    -e --expand                    Add additional wheels to outside of previous wheel.
    -c --reverse-radial-colors     Reverses the order of colours from the center to edge of the wheel.
    -b --reverse-radial-bucketing  Reverses the direction of radial bucketing from the default. Defaults to outwards, or inwards if colors are reversed.
    --verbose                      Enable verbose logging.
    -h, --help                     output usage information
```

# Examples

## HSV Fixed Value
18 Angular Buckets, 12 Radial Buckets, 3 Values

![HSV Fixed Value Color Wheel](integration-tests/input-data/color-wheels/color-wheel-hsv-fixed-value-three.png)

```
color-wheel-renderer color-wheel hsv-fixed-value -f 1 -f 0.6 -f 0.2 -a 18 -r 12
```

---

## HSL Fixed Lightness
18 Angular Buckets, 12 Radial Buckets, 3 Lightness Values

![HSL Fixed Lightness Color Wheel](integration-tests/input-data/color-wheels/color-wheel-hsl-fixed-lightness-three.png)

```
color-wheel-renderer color-wheel hsl-fixed-lightness -f 0.8 -f 0.5 -f 0.2 -a 18 -r 12
```

---

## HSV Fixed Saturation
18 Angular Buckets, 12 Radial Buckets, 3 Saturation Values

![HSV Fixed Saturation Color Wheel](integration-tests/input-data/color-wheels/color-wheel-hsv-fixed-saturation-three.png)

```
color-wheel-renderer color-wheel hsv-fixed-saturation -f 1 -f 0.6 -f 0.2 -a 18 -r 12
```

---

## HSL Fixed Saturation
18 Angular Buckets, 12 Radial Buckets, 3 Saturation Values

![HSL Fixed Saturation Color Wheel](integration-tests/input-data/color-wheels/color-wheel-hsl-fixed-saturation-three.png)

Note that for this wheel the outermost band is white and therefore only 11 buckets are visible.

```
color-wheel-renderer color-wheel hsl-fixed-saturation -f 1 -f 0.6 -f 0.2 -a 18 -r 12
```

---

## HSL Fixed Saturation Smooth
No Bucketing

![HSL Fixed Saturation Smooth Color Wheel](integration-tests/input-data/color-wheels/color-wheel-hsl-fixed-saturation-smooth.png)

```
color-wheel-renderer color-wheel hsl-fixed-saturation
```

---

## HSL Fixed Saturation Smooth Reversed Colors
No Bucketing, Reversed Colors

![HSL Fixed Saturation Smooth Reversed Color Wheel](integration-tests/input-data/color-wheels/color-wheel-hsl-fixed-saturation-smooth-reversed-colors.png)

```
color-wheel-renderer color-wheel hsl-fixed-saturation -c
```

---

## HSL Fixed Saturation Angular Bucketing
36 Angular Buckets

![HSL Fixed Saturation Angular Bucketing Color Wheel](integration-tests/input-data/color-wheels/color-wheel-hsl-fixed-saturation-angular.png)

```
color-wheel-renderer color-wheel hsl-fixed-saturation -a 36
```

---

## HSL Fixed Saturation Radial Bucketing
12 Radial Buckets

![HSL Fixed Saturation Radial Bucketing Color Wheel](integration-tests/input-data/color-wheels/color-wheel-hsl-fixed-saturation-radial.png)

Note that for this wheel the outermost band is white and therefore only 11 buckets are visible.

```
color-wheel-renderer color-wheel hsl-fixed-saturation -r 12
```

---

## HSV Fixed Saturation Expand
12 Angular Buckets, 5 Radial Buckets, 3 Saturation Values, Expand Color Wheel

![HSV Fixed Saturation Expand Color Wheel](integration-tests/input-data/color-wheels/color-wheel-hsv-fixed-saturation-expand.png)

```
color-wheel-renderer color-wheel hsv-fixed-saturation -f 0.25 -f 0.5 -f 1 -a 18 -r 12 -e
```

---

## HSL Fixed Saturation Expand
12 Angular Buckets, 5 Radial Buckets, 3 Saturation Values, Expand Color Wheel, Reverse Bucketing Direction

![HSL Fixed Saturation Expand Color Wheel](integration-tests/input-data/color-wheels/color-wheel-hsl-fixed-saturation-expand.png)

```
color-wheel-renderer color-wheel hsl-fixed-saturation -f 0.1 -f 0.5 -f 1 -a 18 -r 12 -e -b
```

---

## HSV Fixed Saturation Coarse Bucketing
12 Angular Buckets, 5 Radial Buckets

![HSV Fixed Saturation Coarse Color Wheel](integration-tests/input-data/color-wheels/color-wheel-hsv-fixed-saturation-coarse.png)

```
color-wheel-renderer color-wheel hsv-fixed-saturation -a 12 -r 5
```

---

## Full Script
The following script generates the exact set of color wheels rendered on this page.

Note that the HSL Fixed Saturation wheels which use radial bucketing have a slightly larger diameter to compensate for the outer
bucket being pure white.  An alternative to this would be to reverse the radial bucketing direction with the 
`--reverse-radial-bucketing` option. This would in turn result in the center circle being pure black, which may or may not be desirable.
```
color-wheel-renderer color-wheel hsv-fixed-value -f 1 -f 0.6 -f 0.2 -a 18 -r 12 -d 720 -m 40 -o color-wheel-hsv-fixed-value-three.png
color-wheel-renderer color-wheel hsl-fixed-lightness -f 0.8 -f 0.5 -f 0.2 -a 18 -r 12 -d 720 -m 40 -o color-wheel-hsl-fixed-lightness-three.png
color-wheel-renderer color-wheel hsv-fixed-saturation -f 1 -f 0.6 -f 0.2 -a 18 -r 12 -d 720 -m 40 -o color-wheel-hsv-fixed-saturation-three.png
color-wheel-renderer color-wheel hsl-fixed-saturation -f 1 -f 0.6 -f 0.2 -a 18 -r 12 -d 780 -m 10 -o color-wheel-hsl-fixed-saturation-three.png
color-wheel-renderer color-wheel hsl-fixed-saturation -d 720 -m 40 -o color-wheel-hsl-fixed-saturation-smooth.png
color-wheel-renderer color-wheel hsl-fixed-saturation -c -d 720 -m 40 -o color-wheel-hsl-fixed-saturation-smooth-reversed-colors.png
color-wheel-renderer color-wheel hsl-fixed-saturation -a 36 -d 720 -m 40 -o color-wheel-hsl-fixed-saturation-angular.png
color-wheel-renderer color-wheel hsl-fixed-saturation -r 12 -d 780 -m 10 -o color-wheel-hsl-fixed-saturation-radial.png
color-wheel-renderer color-wheel hsv-fixed-saturation -f 0.25 -f 0.5 -f 1 -a 18 -r 12 -e -d 720 -m 40 -o color-wheel-hsv-fixed-saturation-expand.png
color-wheel-renderer color-wheel hsl-fixed-saturation -f 0.1 -f 0.5 -f 1 -a 18 -r 12 -e -b -d 720 -m 40 -o color-wheel-hsl-fixed-saturation-expand.png
color-wheel-renderer color-wheel hsv-fixed-saturation -a 12 -r 5 -d 720 -m 40 -o color-wheel-hsv-fixed-saturation-coarse.png
```
