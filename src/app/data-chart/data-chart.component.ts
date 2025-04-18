import { Component, inject, OnInit } from '@angular/core';
import {
  ChartData,
  ChartOptions,
  Chart,
  registerables,
} from 'chart.js/auto';
import { BaseChartDirective } from 'ng2-charts';
import { DataService } from '../services/api.service';
import { FormsModule } from '@angular/forms';
import { DataChart, FetchData } from './data-model';
import { take } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-data-chart',
  templateUrl: './data-chart.component.html',
  styleUrl: './data-chart.component.scss',
  imports: [BaseChartDirective, FormsModule],
  providers: [DataService],
})
export class DataChartComponent implements OnInit {
  private readonly dataService = inject(DataService);

  protected snapshots: FetchData[] = [];
  protected currentIndex = 0;
  protected playing = false;
  protected chartData: ChartData<'bar'> = { labels: ['range'], datasets: [] };
  protected chartOptions: ChartOptions = { responsive: true };
  protected playDuration = 10000;

  protected readonly prevBtn: string = 'Prev'
  protected readonly nextBtn: string = 'Next'
  protected readonly playBtn: string = 'Play'
  protected readonly stopBtn: string = 'Stop'

  constructor() {
    Chart.register(...registerables);
  }

  public ngOnInit(): void {
    this.dataService.getData().pipe(take(1)).subscribe((data) => {
      this.snapshots = JSON.parse(data);
      this.renderSnapshot(0);
    });
  }

  protected renderSnapshot(index: number): void {
    const snap = this.snapshots[index];
    this.currentIndex = index;
    const bids: DataChart[] = snap.bids.slice().reverse();
    const asks: DataChart[] = snap.asks;
    const labels = [
      ...bids.map((item) => item.price),
      ...asks.map((elem) => elem.price),
    ];
    const volumes = [
      ...bids.map((item) => -item.volume),
      ...asks.map((elem) => elem.volume),
    ];

    this.chartData = {
      labels,
      datasets: [
        {
          label: 'Order Book',
          data: volumes,
          backgroundColor: volumes.map((v) =>
            v < 0 ? 'rgba(0, 200, 0, 0.6)' : 'rgba(200, 0, 0, 0.6)'
          ),
        },
      ],
    };
  }

  protected prev(): void {
    if (this.currentIndex > 0) {
      this.renderSnapshot(this.currentIndex - 1);
    }
  }

  protected next(): void {
    if (this.currentIndex < this.snapshots.length - 1) {
      this.renderSnapshot(this.currentIndex + 1);
    }
  }

  protected onSliderChange(event: Event): void {
    this.renderSnapshot(+(event.target as HTMLInputElement).value);
  }

  protected play(): void {
    if (this.playing) return;
    this.playing = true;
    const timestamps = this.snapshots.map((s) =>
      new Date(s.timestamp).getTime()
    );
    const start = timestamps[0];
    const end = timestamps[timestamps.length - 1];
    const totalDuration = end - start;

    const animate = (i: number) => {
      if (!this.playing || i >= this.snapshots.length) {
        this.playing = false;
        return;
      }
      this.renderSnapshot(i);
      const now = timestamps[i];
      const next = timestamps[i + 1] || now;
      const delay = ((next - now) / totalDuration) * this.playDuration;

      setTimeout(() => animate(i + 1), delay);
    };

    animate(this.currentIndex);
  }

  protected stop(): void {
    this.playing = false;
  }
}
