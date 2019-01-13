import { ExecutionContext } from 'ava';
import { IntegrationTestConsumerHelper } from '../src/color-wheels/testing/integration-test-consumer-helper';
import { compareImage } from '../src/common/compare-image';

export async function evaluateComparisons<T>(t: ExecutionContext<T>, comparisonHelper: IntegrationTestConsumerHelper) {
  for (const comparison of comparisonHelper.objectComparisons) {
    t.deepEqual(comparison.actual, comparison.expected, comparison.message);
  }

  for (const comparison of comparisonHelper.imageComparisons) {
    const result = await compareImage(comparison.expected, comparison.actual);
    t.deepEqual(result.differences, [], comparison.message);
  }
}
