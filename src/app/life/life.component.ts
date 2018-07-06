import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/index";

@Component({
  selector: 'app-life',
  templateUrl: './life.component.html',
  styleUrls: ['./life.component.css']
})
export class LifeComponent implements OnInit {

  genCnt = 1;
  lifeSize = 50;
  range = 0.70;

  private interval;

  generation: boolean[][] = [];
  nextGeneration = [];

  constructor() {
  }

  generate(random = false) {
    for (let y = 0; y < this.lifeSize; y++) {
      this.generation[y] = [];
      for (let x = 0; x < this.lifeSize; x++) {
        this.generation[y][x] = random ? Math.random() >= this.range : false;
      }
    }
  }

  randomGenerate() {
    this.generate(true);
  }

  toggle(pos: number[]) {
    this.generation[pos[0]][pos[1]] = !this.generation[pos[0]][pos[1]];
    this.neighborsPos(pos);
  }

  next() {
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
      this.stop();
      return;
    }
    this.nextGeneration.forEach(pos => this.toggle(pos));
    this.nextGeneration = [];
    console.log('next');
  }

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

  start() {
    this.stop();
    this.interval = setInterval(() => this.next(), 100);
    console.log('start');
  }

  clear() {
    this.stop();
    this.generate();
    console.log('clear');
  }

  stop() {
    clearInterval(this.interval);
    console.log('stop');
  }

  figure() {
    for (let y = 0; y < this.lifeSize; y++) {
      this.generation[y] = [];
      for (let x = 0; x < this.lifeSize; x++) {
        if (x === y || ( x + y === this.lifeSize - 1)) {
          this.generation[y][x] = true;
        } else {
          this.generation[y][x] = false;
        }
        // this.generation[y][x] = random ? Math.random() >= this.range : false;
      }
    }
  }


  ngOnInit() {
    this.generate();
  }

}
