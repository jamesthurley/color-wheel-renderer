import test from 'ava';
import { VoteTally, SolutionTally } from './vote-tally';

class Person {
  constructor(public readonly name: string, public readonly age: number) {
  }
}

test('it should tally complex types', t => {
  const tally = new VoteTally<Person>('People');
  tally.castVote(new Person('amy', 30));
  tally.castVote(new Person('ben', 30));
  tally.castVote(new Person('chris', 25));
  tally.castVote(new Person('dorothy', 27));
  tally.castVote(new Person('ben', 30));
  tally.castVote(new Person('ben', 35));
  tally.castVote(new Person('chris', 25));
  tally.castVote(new Person('ben', 30));
  tally.castVote(new Person('evan', 47));

  t.deepEqual(new Person('ben', 30), tally.winner);

  t.is(6, tally.solutions.length);

  t.deepEqual(new Person('amy', 30), tally.solutions[0].solution);
  t.is(1, tally.solutions[0].voteCount);

  t.deepEqual(new Person('ben', 30), tally.solutions[1].solution);
  t.is(3, tally.solutions[1].voteCount);

  t.deepEqual(new Person('chris', 25), tally.solutions[2].solution);
  t.is(2, tally.solutions[2].voteCount);

  t.deepEqual(new Person('dorothy', 27), tally.solutions[3].solution);
  t.is(1, tally.solutions[3].voteCount);

  t.deepEqual(new Person('ben', 35), tally.solutions[4].solution);
  t.is(1, tally.solutions[4].voteCount);

  t.deepEqual(new Person('evan', 47), tally.solutions[5].solution);
  t.is(1, tally.solutions[5].voteCount);
});
