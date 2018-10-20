import test from 'ava';
import { VoteTally, TallySortMode } from './vote-tally';

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

test('it should tally complex types with tie breaker', t => {
  // Youngest wins in a tie break.
  const tally1 = new VoteTally<Person>('People', p => 0 - p.age);

  // Oldest wins in a tie break.
  const tally2 = new VoteTally<Person>('People', p => p.age);

  // Oldest wins followed by most votes.
  const tally3 = new VoteTally<Person>('People', p => p.age, TallySortMode.quantifierThenVotes);

  // Oldest wins followed by most votes 2.
  const tally4 = new VoteTally<Person>('People', p => p.age, TallySortMode.quantifierThenVotes);

  const castVotes = (tally: VoteTally<Person>) => {
    tally.castVote(new Person('amy', 30));
    tally.castVote(new Person('ben', 30));
    tally.castVote(new Person('chris', 25));
    tally.castVote(new Person('dorothy', 47));
    tally.castVote(new Person('evan', 47));

    tally.castVote(new Person('ben', 30));
    tally.castVote(new Person('ben', 30));
    tally.castVote(new Person('ben', 30));

    tally.castVote(new Person('chris', 25));
    tally.castVote(new Person('chris', 25));
    tally.castVote(new Person('chris', 25));

    tally.castVote(new Person('dorothy', 47));

    // Vote order: chris/ben = 4, dorothy = 2, evan/amy = 1.
  };

  castVotes(tally1);
  castVotes(tally2);
  castVotes(tally3);
  castVotes(tally4);

  // Set votes for evan to 3 for tally 4.
  tally4.castVote(new Person('evan', 47));
  tally4.castVote(new Person('evan', 47));

  t.deepEqual(new Person('chris', 25), tally1.winner);
  t.deepEqual(new Person('ben', 30), tally2.winner);
  t.deepEqual(new Person('dorothy', 47), tally3.winner);
  t.deepEqual(new Person('evan', 47), tally4.winner);

  const assertTallySolutions = (tally: VoteTally<Person>, evanVoteCount: number = 1) => {
    t.is(5, tally.solutions.length);

    t.deepEqual(new Person('amy', 30), tally.solutions[0].solution);
    t.is(1, tally.solutions[0].voteCount);

    t.deepEqual(new Person('ben', 30), tally.solutions[1].solution);
    t.is(4, tally.solutions[1].voteCount);

    t.deepEqual(new Person('chris', 25), tally.solutions[2].solution);
    t.is(4, tally.solutions[2].voteCount);

    t.deepEqual(new Person('dorothy', 47), tally.solutions[3].solution);
    t.is(2, tally.solutions[3].voteCount);

    t.deepEqual(new Person('evan', 47), tally.solutions[4].solution);
    t.is(evanVoteCount, tally.solutions[4].voteCount);
  };

  assertTallySolutions(tally1);
  assertTallySolutions(tally2);
  assertTallySolutions(tally3);
  assertTallySolutions(tally4, 3);
});
