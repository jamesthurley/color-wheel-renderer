import { isUndefined } from 'util';
import { jsonEquals } from './json-equals';
import { Log } from './log';
import { jsonStringify } from './json-stringify';

export class VoteTally<TSolution> {
  private unsuccessfulVotes: number = 0;
  private readonly mutableSolutions: Array<SolutionTally<TSolution>> = [];

  constructor(public  readonly name: string) {

  }

  public get solutions(): ReadonlyArray<SolutionTally<TSolution>> {
    return [...this.mutableSolutions];
  }

  public get winner(): TSolution | undefined {

    const unsuccessfulVotesMessage = `${this.unsuccessfulVotes} unsuccessful votes.`;
    if (this.solutions.length === 0) {
      Log.verbose(`${this.name}: No solutions found. ${unsuccessfulVotesMessage}`);
      return undefined;
    }

    const solutionsCopy = [...this.mutableSolutions];
    solutionsCopy.sort((a, b) => b.voteCount - a.voteCount);

    if (solutionsCopy.length === 1) {
      Log.verbose(`${this.name}: 1 solution found with ${solutionsCopy[0].voteCount} vote(s). ${unsuccessfulVotesMessage}`);
    }
    else {
      Log.verbose(`${this.name}: ${solutionsCopy.length} solution(s) found. ${unsuccessfulVotesMessage}`);
      Log.verbose(jsonStringify(solutionsCopy));
    }

    return solutionsCopy[0].solution;
  }

  public castVote(solution: TSolution | undefined) {
    if (isUndefined(solution)) {
      ++this.unsuccessfulVotes;
      return;
    }

    const matching = this.mutableSolutions.find(v => jsonEquals(v.solution, solution));
    if (!matching) {
      this.mutableSolutions.push(new SolutionTally<TSolution>(solution));
    }
    else {
      matching.vote();
    }
  }
}

export class SolutionTally<TSolution> {
  private mutableVoteCount: number = 1;

  constructor(
    public readonly solution: TSolution) {
  }

  public get voteCount(): number {
    return this.mutableVoteCount;
  }

  public vote(): void {
    ++this.mutableVoteCount;
  }
}
