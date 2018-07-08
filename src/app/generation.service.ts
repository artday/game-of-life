import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GenerationService {

  private range = 0.5;

  private twoDimArray(state: Function, size) {
    const fn = (arr, val: Function, cnt) => arr.length < cnt ? (arr.push(val()), fn(arr, val, cnt)) : arr;
    return fn([], () => [], size).map(res => fn(res, state, size));
  }

  randomGeneration(size, randomRange: number = 0.5) {
    console.log(randomRange);
    return this.twoDimArray(() => Math.random() >= randomRange, size);
  }

  emptyGeneration(size) {
    return this.twoDimArray(() => false, size);
  }

}
