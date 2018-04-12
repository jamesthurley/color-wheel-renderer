import test from 'ava';
import { FitFrameSizeToTarget } from './fit-frame-size-to-target';
import { Size } from '../common/size';

test('when large frame with supported aspect ratio, it should resize to fit', t => {
  t.deepEqual(
    FitFrameSizeToTarget.execute(new Size(1920, 1080)),
    new Size(1080, 607));
});

test('when small frame with supported aspect ratio, it should not modify', t => {
  t.deepEqual(
    FitFrameSizeToTarget.execute(new Size(540, 300)),
    new Size(540, 300));
});

test('when wide frame, it should resize to fit and expand vertically', t => {
  t.deepEqual(
    FitFrameSizeToTarget.execute(new Size(1920, 500)),
    new Size(1080, 565));
});

test('when tall frame, it should resize to fit and expand horizontally', t => {
  t.deepEqual(
    FitFrameSizeToTarget.execute(new Size(1920, 4000)),
    new Size(1080, 1350));
});
