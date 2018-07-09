import {Component, Input, OnInit} from '@angular/core';
import {GenerationService} from '../generation.service';

@Component({
  selector: 'app-life',
  templateUrl: './life.component.html',
  styleUrls: ['./life.component.css'],
})
export class LifeComponent implements OnInit {

  genCnt: number;
  lifeSize: number = 50;
  generation: boolean[][];
  randomRange: number = -0.7;
  speed = -300;

  isClear: boolean;
  isPlay: boolean;
  drawed: number[][] = [];

  private interval: number;

  constructor(private service: GenerationService) {}

  /* add cells changed manually to drawArray for saving figure; */
  draw(pos: number[]) {
    this.isClear = false;
    this.drawed.push(pos);
  }

  toggle(pos: number[]) {
    this.generation[pos[0]][pos[1]] = !this.generation[pos[0]][pos[1]];
  }

  next() {
    this.generateNext();
  }

  random() {
    this.generateRandom();
  }

  clear(): void {
    this.drawed = [];
    this.generateEmpty();
  }

  start(): void {
    this.stop();
    this.isPlay = true;
    this.interval = setInterval(() => this.next(), this.speed * (-1));
  }

  stop(): void {
    this.isPlay = false;
    clearInterval(this.interval);
  }

  private generateRandom(): void {
    this.setGeneration(this.randomGeneration());
  }

  private generateEmpty(): void {
    this.setGeneration(this.emptyGeneration());
  }

  private generateNext(): void {
    this.updateGeneration(this.nextGeneration());
  }

  private updateGeneration(serviceGeneration: number[][]): void {
    if (!serviceGeneration.length) {
      this.isClear = false;
      this.stop();
      return;
    }
    serviceGeneration.forEach(pos => this.toggle(pos));
  }

  private setGeneration(serviceGeneration: boolean[][]): void {
    this.stop();
    this.generation = serviceGeneration;
  }

  private randomGeneration(): boolean[][] {
    this.isClear = false;
    return this.service.randomGeneration(this.lifeSize, this.randomRange * (-1));
  }

  private emptyGeneration(): boolean[][] {
    this.isClear = true;
    return this.service.emptyGeneration(this.lifeSize);
  }

  private nextGeneration(): number[][] {
    return this.service.mustUpdateByLiveConditions(this.generation);
  }

  ngOnInit(): void {
    this.setGeneration(this.emptyGeneration());
    this.genCnt = 1;
  }

  /*show() {
    console.log(this.randomRange * (-1));
  }*/

  /*generate(random = false) {
  /!*
  1)
  for (let y = 0; y < this.lifeSize; y++) {
    this.generation[y] = [];
    for (let x = 0; x < this.lifeSize; x++) {
      this.generation[y][x] = random ? Math.random() >= this.range : false;
    }
  }

  2)
  this.callInCycle(0, this.lifeSize - 1, (y) => {
    let Y = this.generation[y] = [];
    this.callInCycle(0, this.lifeSize - 1, (x) => {
      Y[x] = random ? Math.random() >= this.range : false;
    });
  });

  *!/

  //const fn = (arr, val, size) => arr.length < size ? (arr.push(val()) , fn(arr, val(), size)) : arr;
  // fn(this.generation, 50, []).forEach(res => fn(res, 50, false));
  // return ( fn([], [], 50).map(res => fn(res, false , 50)) );
  //let arr=[];
  //fn(arr, function(){return []}, 50).forEach(res => fn(res, function(){return Math.random() >= this.range}, 50))();
  //return arr;

  const fn = (arr, val, size) => arr.length < size ? (arr.push(val()) , fn(arr, val, size)) : arr;
  // return ( fn([], [], 50).map(res => fn(res, false , 50)) );
  return fn([], () => [] , 50).map(res => fn(res, () => Math.random() >= this.range, 50 ));
}*/

  /*  callInCycle(from, to, callable) {
    for (let i = from; i <= to; i++) {
      callable(i);
    }
  }*/

  /*
  neighborsPos(pos: number[]) {
    const y = pos[0];
    const x = pos[1];
    const neighbors = [];
    for (let Y = y - 1; Y <= y + 1; Y++) {
      for (let X = x - 1; X <= x + 1; X++) {
        const posY = Y < 0 ? (this.lifeSize - 1) : (Y > (this.lifeSize - 1) ? 0 : Y);
        const posX = X < 0 ? (this.lifeSize - 1) : (X > (this.lifeSize - 1) ? 0 : X);
        if (!(posY === y && posX === x)) {
          neighbors.push([posY, posX]);
        }
      }
    }
    return neighbors;
  }
  */

  /*
  figure() {
    for (let y = 0; y < this.lifeSize; y++) {
      this.generation[y] = [];
      for (let x = 0; x < this.lifeSize; x++) {
        if (x === y || ( x + y === this.lifeSize - 1)) {
          this.generation[y][x] = true;
        } else {
          this.generation[y][x] = false;
        }
      }
    }
  }
  */

  /*
  next(): void {
    this.generation
      .forEach((row, y) => row
        .forEach((col, x) => {
          const isAlive = col;
          const aliveNeighbors = this.neighborsPos([y, x]).filter(n => this.generation[n[0]][n[1]]).length;
          if ((aliveNeighbors > 3 || aliveNeighbors < 2) && isAlive) {
            this.nextGeneration.push([y, x]);
          }
          if (!isAlive && aliveNeighbors === 3) {
            this.nextGeneration.push([y, x]);
          }
        }));
    if (!this.nextGeneration.length) {
      this.isClear = false;
      this.stop();
      return;
    }
    this.nextGeneration.forEach(pos => this.toggle(pos));
    this.nextGeneration = [];
  }
  */
}
