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

  /* add cell`s coords changed manually to drawArray for saving figure in future */
  draw(pos: number[]) {
    this.isClear = false;
    this.genCnt = this.genCnt === 0 ? 1: this.genCnt;
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
    this.stop(); this.isPlay = true;
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
      this.isClear = false; this.stop();
      return;
    }
    serviceGeneration.forEach(pos => this.toggle(pos));
  }

  private setGeneration(serviceGeneration: boolean[][]): void {
    this.stop();
    this.generation = serviceGeneration;
  }

  private randomGeneration(): boolean[][] {
    this.isClear = false; this.genCnt = 1;
    return this.service.randomGeneration(this.lifeSize, this.randomRange * (-1));
  }

  private emptyGeneration(): boolean[][] {
    this.isClear = true; this.genCnt = 0;
    return this.service.emptyGeneration(this.lifeSize);
  }

  private nextGeneration(): number[][] {
    this.genCnt++;
    return this.service.mustUpdateByLiveConditions(this.generation);
  }

  ngOnInit(): void {
    this.setGeneration(this.emptyGeneration());
    this.genCnt = 0;
  }
}
