import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GenerationService {

  /* Nesting ForEach with callback */
  private twoDimArrayCall(arr: boolean[][], callable) {
    return arr.forEach((row, y) => row.forEach((val, x) => callable([y, x], val)));
  }

  /* Callable For()  for recursively using */
  private callInFor(from, to, callable) {
    for (let i = from; i <= to; i++) {
      callable(i);
    }
  }

  /* Return Recursive f-on for filling two-dimensional array */
  private twoDimArray(state: Function, size) {
    const fn = (arr, val: Function, cnt) => arr.length < cnt ? (arr.push(val()), fn(arr, val, cnt)) : arr;
    return fn([], () => [], size).map(res => fn(res, state, size));
  }

  /* Get neighbors Position Coordinates */
  private neighborsPos(pos: number[], lifeSize: number) {
    const neighbors = [];
    this.callInFor(pos[0] - 1, pos[0] + 1, (y) => {
      this.callInFor(pos[1] - 1, pos[1] + 1, (x) => {
        /* Resign across the border coordinates */
        const posArr = [y, x].map(p => p < 0 ? (lifeSize - 1) : (p > (lifeSize - 1) ? 0 : p));
        /* Exclude own position */
        if (!(posArr[0] === pos[0] && posArr[1] === pos[1])) { neighbors.push(posArr); }
      });
    });
    return neighbors;
  }

  /* Get only Alive neighbors Position */
  private getAliveNeighbors(pos: number[], generation: boolean[][]) {
    return this.neighborsPos(pos, generation.length)
      .filter(n => generation[n[0]][n[1]]);
  }

  /* Check if must be inverted according Life Conditions */
  private mustBeToggledByRules(alive: boolean, neighborsCnt: number) {
    return (!alive && neighborsCnt === 3) ||
      ((neighborsCnt > 3 || neighborsCnt < 2) && alive);
  }

  /* Generate and return two-dimensional array with Random value */
  randomGeneration(size, randomRange) {
    return this.twoDimArray(() => Math.random() >= randomRange, size);
  }

  /* Generate and return two-dimensional array with false value */
  emptyGeneration(size) {
    return this.twoDimArray(() => false, size);
  }

  /* Find in current generation only those cell`s coordinates that need to be updated according rules */
  mustUpdateByLiveConditions(generation: boolean[][]) {
    const mustBeToggled = [];
    this.twoDimArrayCall(generation, (pos, isAlive) => {
      const aliveNeighborsCnt = this.getAliveNeighbors(pos, generation).length;
        if (this.mustBeToggledByRules(isAlive, aliveNeighborsCnt)) { mustBeToggled.push(pos); }
    });
    return mustBeToggled;
  }
}
