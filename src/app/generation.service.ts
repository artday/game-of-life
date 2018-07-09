import {Injectable} from '@angular/core';
import {Observable} from "rxjs/index";

@Injectable({
  providedIn: 'root'
})
export class GenerationService {

  private twoDimArrayCall(arr: boolean[][], callable) {
    return arr.forEach((row, y) => row.forEach((val, x) => callable([y, x], val)));
  }

  private callInFor(from, to, callable) {
    for (let i = from; i <= to; i++) {
      callable(i);
    }
  }

  private twoDimArray(state: Function, size) {
    const fn = (arr, val: Function, cnt) => arr.length < cnt ? (arr.push(val()), fn(arr, val, cnt)) : arr;
    return fn([], () => [], size).map(res => fn(res, state, size));
  }

  private neighborsPos(pos: number[], lifeSize: number) {
    const neighbors = [];
    this.callInFor(pos[0] - 1, pos[0] + 1, (y) => {
      this.callInFor(pos[1] - 1, pos[1] + 1, (x) => {
        const posArr = [y, x].map(p => p < 0 ? (lifeSize - 1) : (p > (lifeSize - 1) ? 0 : p));
        if (!(posArr[0] === pos[0] && posArr[1] === pos[1])) {
          neighbors.push(posArr);
        }
      });
    });
    return neighbors;
  }

  private getAliveNeighbors(pos: number[], generation: boolean[][]) {
    return this.neighborsPos(pos, generation.length)
      .filter(n => generation[n[0]][n[1]]);
  }

  private mustBeToggledByRules(alive: boolean, neighborsCnt: number) {
    return (!alive && neighborsCnt === 3) ||
      ((neighborsCnt > 3 || neighborsCnt < 2) && alive);
  }

  randomGeneration(size, randomRange) {
    return this.twoDimArray(() => Math.random() >= randomRange, size);
  }

  emptyGeneration(size) {
    return this.twoDimArray(() => false, size);
  }

  mustUpdateByLiveConditions(generation: boolean[][]) {
    const mustBeToggled = [];
    this.twoDimArrayCall(generation, (pos, isAlive) => {
      const aliveNeighborsCnt = this.getAliveNeighbors(pos, generation).length;
        if(this.mustBeToggledByRules(isAlive, aliveNeighborsCnt))
          mustBeToggled.push(pos);
    });
    return mustBeToggled;
  }
}
