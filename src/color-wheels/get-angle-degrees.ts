export function getAngleDegrees(centerX: number, centerY: number, relativeX: number, relativeY: number) {
  const angleRadians = Math.PI + Math.atan2(-relativeX + centerX, relativeY - centerY);
  return (angleRadians * 180 / Math.PI) % 360;
}
