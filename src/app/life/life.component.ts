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

  /* add cell`s coordinates changed manually to drawArray for saving figure in future */
  draw(pos: number[]) {
    this.isClear = false;
    this.genCnt = this.genCnt === 0 ? 1: this.genCnt;
    this.drawed.push(pos);

  }
  
  /* invert cell value */
  toggle(pos: number[]) {
    this.generation[pos[0]][pos[1]] = !this.generation[pos[0]][pos[1]];
  }

  /* onNext operations */
  next() {
    this.generateNext();
  }

  /* onRandom operations */
  random() {
    this.generateRandom();
  }

  /* onClear operations */
  clear(): void {
    this.drawed = [];
    this.generateEmpty();
  }

  /* onStart operations */
  start(): void {
    this.stop(); this.isPlay = true;
    this.interval = setInterval(() => this.next(), this.speed * (-1));
  }

  /* onStop operations */
  stop(): void {
    this.isPlay = false;
    clearInterval(this.interval);
  }
  /* Generate Random Generation */
  private generateRandom(): void {
    this.setGeneration(this.randomGeneration());
  }

  /* generate Empty/First Generation */
  private generateEmpty(): void {
    this.setGeneration(this.emptyGeneration());
  }

  /* generate Next Generation */
  private generateNext(): void {
    this.updateGeneration(this.nextGeneration());
  }

  /* updating Generation from Generation Getters */
  private updateGeneration(serviceGeneration: number[][]): void {
    if (!serviceGeneration.length) {
      this.isClear = false; this.stop();
      return;
    }
    serviceGeneration.forEach(pos => this.toggle(pos));
  }

  /* setting Generation from Generation Getters */
  private setGeneration(serviceGeneration: boolean[][]): void {
    this.stop();
    this.generation = serviceGeneration;
  }

  /* Get Random Generation from service */
  private randomGeneration(): boolean[][] {
    this.isClear = false; this.genCnt = 1;
    return this.service.randomGeneration(this.lifeSize, this.randomRange * (-1));
  }

  /* Get Empty Generation from service */
  private emptyGeneration(): boolean[][] {
    this.isClear = true; this.genCnt = 0;
    return this.service.emptyGeneration(this.lifeSize);
  }

  /* Get cells coordinates which must be inverted  */
  private nextGeneration(): number[][] {
    this.genCnt++;
    return this.service.mustUpdateByLiveConditions(this.generation);
  }

  ngOnInit(): void {
    this.setGeneration(this.emptyGeneration());
    this.genCnt = 0;
  }
}
