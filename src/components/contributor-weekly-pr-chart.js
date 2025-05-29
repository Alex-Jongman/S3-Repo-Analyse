import { LitElement, html, css } from 'lit';
import Chart from 'chart.js/auto';

/**
 * Web component for visualizing weekly pull request counts for a contributor.
 *
 * @element contributor-weekly-pr-chart
 * @property {Array} weeklyData - Array of { week: string, count: number }
 * @property {String} contributor - Contributor username
 */
export class ContributorWeeklyPrChart extends LitElement {
  static properties = {
    weeklyData: { type: Array },
    contributor: { type: String }
  };

  static styles = [
    css`
      :host { display: block; }
      canvas { width: 100% !important; max-width: 700px; min-width: 400px; height: 320px !important; }
    `
  ];

  constructor() {
    super();
    this.weeklyData = [];
    this.contributor = '';
    this._chartInstance = null;
  }

  render() {
    return html`<canvas id="chart-weekly-${this.contributor}" width="700" height="320"></canvas>`;
  }

  updated() {
    this.renderChart();
  }

  renderChart() {
    const canvas = this.renderRoot.querySelector('canvas');
    if (!canvas || !this.weeklyData || this.weeklyData.length === 0) return;
    if (this._chartInstance) {
      this._chartInstance.destroy();
      this._chartInstance = null;
    }
    const labels = this.weeklyData.map(w => w.week);
    const counts = this.weeklyData.map(w => w.count);
    const barColors = counts.map(val => val >= 10 ? 'rgba(76, 175, 80, 0.7)' : 'rgba(244, 67, 54, 0.7)');
    this._chartInstance = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'PRs per week',
            data: counts,
            backgroundColor: barColors
          }
        ]
      },
      options: {
        indexAxis: 'x',
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: true, text: `Weekly PRs for ${this.contributor}` }
        },
        scales: {
          x: { title: { display: true, text: 'Week' } },
          y: { title: { display: true, text: 'Number of PRs' }, beginAtZero: true, precision: 0 }
        }
      }
    });
  }

  disconnectedCallback() {
    if (this._chartInstance) {
      this._chartInstance.destroy();
      this._chartInstance = null;
    }
    super.disconnectedCallback();
  }
}

customElements.define('contributor-weekly-pr-chart', ContributorWeeklyPrChart);
