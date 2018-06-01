import { isUndefined, isNull } from 'util';
import { jsonEquals } from './json-equals';
import { Log } from './log';
import { jsonStringify } from './json-stringify';

export class VoteTally<TSolution> {
  private voteRecord: Array<number | null> = [];
  private readonly mutableSolutions: Array<SolutionTally<TSolution>> = [];

  constructor(public readonly name: string) {

  }

  public get solutions(): ReadonlyArray<SolutionTally<TSolution>> {
    return [...this.mutableSolutions];
  }

  public get winner(): TSolution | undefined {

    const voteRecordString = this.createVoteRecordString();
    if (this.solutions.length === 0) {
      Log.verbose(`${this.name}: No solutions found. ${voteRecordString}`);
      return undefined;
    }

    const solutionsCopy = [...this.mutableSolutions];
    solutionsCopy.sort((a, b) => b.voteCount - a.voteCount);

    if (solutionsCopy.length === 1) {
      Log.verbose(`${this.name}: 1 solution found with ${solutionsCopy[0].voteCount} vote(s). ${voteRecordString}`);
    }
    else {
      Log.verbose(`${this.name}: ${solutionsCopy.length} solution(s) found. ${voteRecordString}`);
    }
    Log.verbose(jsonStringify(solutionsCopy));

    return solutionsCopy[0].solution;
  }

  public castVote(solution: TSolution | undefined) {
    if (isUndefined(solution)) {
      this.voteRecord.push(null);
      return;
    }

    const matchingIndex = this.mutableSolutions.findIndex(v => jsonEquals(v.solution, solution));
    if (matchingIndex === -1) {
      this.voteRecord.push(this.mutableSolutions.length);
      this.mutableSolutions.push(new SolutionTally<TSolution>(solution));
    }
    else {
      this.voteRecord.push(matchingIndex);
      const matching = this.mutableSolutions[matchingIndex];
      matching.vote();
    }
  }

  private createVoteRecordString(): string {
    let spacer = '';
    if (this.voteRecord.some(v => !isNull(v) && v > 9)) {
      spacer = ' ';
    }

    return 'Votes: [' + this.voteRecord.reduce((p: string, c: number | null) => p + (isNull(c) ? 'x' : c) + spacer, '') + ']';
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
