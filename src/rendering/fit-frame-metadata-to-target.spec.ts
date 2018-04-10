import test from 'ava';
import { FitFrameMetadataToTarget } from './fit-frame-metadata-to-target';
import { FrameMetadata } from './frame-metadata';

test('when large frame with supported aspect ratio, it should resize to fit', t => {
  t.deepEqual(
    FitFrameMetadataToTarget.execute(new FrameMetadata(1920, 1080)),
    new FrameMetadata(1080, 607));
});

test('when small frame with supported aspect ratio, it should not modify', t => {
  t.deepEqual(
    FitFrameMetadataToTarget.execute(new FrameMetadata(540, 300)),
    new FrameMetadata(540, 300));
});

test('when wide frame, it should resize to fit and expand vertically', t => {
  t.deepEqual(
    FitFrameMetadataToTarget.execute(new FrameMetadata(1920, 500)),
    new FrameMetadata(1080, 565));
});

test('when tall frame, it should resize to fit and expand horizontally', t => {
  t.deepEqual(
    FitFrameMetadataToTarget.execute(new FrameMetadata(1920, 4000)),
    new FrameMetadata(1080, 1350));
});
