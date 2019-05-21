import {ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, ViewChild} from '@angular/core';
import * as d3 from 'd3';

import {TemperatureModel} from '../temperature-value';

@Component({
  selector: 'app-temperature-chart',
  templateUrl: './temperature-chart.component.html',
  styleUrls: ['./temperature-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemperatureChartComponent implements OnChanges {
  @ViewChild('chart')
  chartElement: ElementRef;

  parseDate = d3.timeParse('%d-%m-%Y');

  @Input()
  temperatureStatus: TemperatureModel[];

  private svgElement: HTMLElement;
  private chartProps: any;

  constructor() { }

  ngOnChanges() {
    if (this.temperatureStatus &&  this.chartProps) {
      this.updateChart();
    } else if (this.temperatureStatus) {
      this.buildChart();
    }
  }

  formatDate() {
    this.temperatureStatus.forEach(ms => {
      if (typeof ms.ts === 'string') {
        ms.ts = this.parseDate(ms.ts);
      }
    });
  }

  updateChart() {
    let _this = this;
    this.formatDate();

    // Scale the range of the data again
    this.chartProps.x.domain(d3.extent(this.temperatureStatus, function (d) {
      if (d.ts instanceof Date) {
        return d.ts.getTime();
      }
    }));

    this.chartProps.y.domain([0, d3.max(this.temperatureStatus, function (d) { return d.val; })]);

    // Select the section we want to apply our changes to
    this.chartProps.svg.transition();

    // Make the changes to the line chart
    this.chartProps.svg.select('.line.line1') // update the line
      .attr('d', this.chartProps.valueline(this.temperatureStatus));

    this.chartProps.svg.select('.x.axis') // update x axis
      .call(this.chartProps.xAxis);

    this.chartProps.svg.select('.y.axis') // update y axis
      .call(this.chartProps.yAxis);
  }

  buildChart() {
    this.chartProps = {};
    this.formatDate();

    // Set the dimensions of the canvas / graph
    var margin = { top: 30, right: 20, bottom: 30, left: 50 },
     width = 600 - margin.left - margin.right,
     height = 270 - margin.top - margin.bottom;

    // Set the ranges
    this.chartProps.x = d3.scaleTime().range([0, width]);
    this.chartProps.y = d3.scaleLinear().range([height, 0]);

    // Define the axes
    var xAxis = d3.axisBottom(this.chartProps.x);
    var yAxis = d3.axisLeft(this.chartProps.y).ticks(5);

    let _this = this;

    // Define the line
    var valueline = d3.line<TemperatureModel>()
     .x(function (d) {
       if (d.ts instanceof Date) {
         return _this.chartProps.x(d.ts.getTime());
       }
     })
     .y(function (d) { console.log('Close market'); return _this.chartProps.y(d.val); });

    var svg = d3.select(this.chartElement.nativeElement)
     .append('svg')
     .attr('width', width + margin.left + margin.right)
     .attr('height', height + margin.top + margin.bottom)
     .append('g')
     .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scale the range of the data
    this.chartProps.x.domain(
     d3.extent(_this.temperatureStatus, function (d) {
       if (d.ts instanceof Date)
         return (d.ts as Date).getTime();
     }));
    this.chartProps.y.domain([0, d3.max(this.temperatureStatus, function (d) {
     return Math.max(d.val);
    })]);

  
    // Add the valueline path.
    svg.append('path')
     .attr('class', 'line line1')
     .style('stroke', 'black')
     .style('fill', 'none')
     .attr('d', valueline(_this.temperatureStatus));


    // Add the X Axis
    svg.append('g')
     .attr('class', 'x axis')
     .attr('transform', `translate(0,${height})`)
     .call(xAxis);

    // Add the Y Axis
    svg.append('g')
     .attr('class', 'y axis')
     .call(yAxis);

    // Setting the required objects in chartProps so they could be used to update the chart
    this.chartProps.svg = svg;
    this.chartProps.valueline = valueline;
    this.chartProps.xAxis = xAxis;
    this.chartProps.yAxis = yAxis;
    }
}
