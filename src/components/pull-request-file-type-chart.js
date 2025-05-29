import { LitElement, html, css } from 'lit';
import Chart from 'chart.js/auto';

/**
 * Web component for rendering a file type bar chart for a pull request.
 *
 * @element pull-request-file-type-chart
 * @property {Object} fileTypeStats - File type stats object { ext: { additions, deletions, count } }
 * @property {String} chartId - Unique chart DOM id
 */
export class PullRequestFileTypeChart extends LitElement {
  static properties = {
    fileTypeStats: { type: Object },
    chartId: { type: String }
  };

  static styles = [
    css`
      :host { display: block; }
      canvas { width: 100% !important; max-width: 700px; min-width: 400px; height: 240px !important; }
    `
  ];

  constructor() {
    super();
    this.fileTypeStats = {};
    this.chartId = '';
    this._chartInstance = null;
  }

  /**
   * Render the chart canvas.
   * @returns {import('lit').TemplateResult}
   */
  render() {
    return html`<canvas id="${this.chartId}" width="700" height="240" data-chart="${this.chartId}"></canvas>`;
  }

  /**
   * After update, render the chart.
   */
  updated() {
    this.renderChart();
  }

  /**
   * Render the Chart.js bar chart for file type stats.
   */
  renderChart() {
    const canvas = this.renderRoot.querySelector('canvas');
    if (!canvas || !this.fileTypeStats || Object.keys(this.fileTypeStats).length === 0) return;
    if (this._chartInstance) {
      this._chartInstance.destroy();
      this._chartInstance = null;
    }
    const labels = Object.keys(this.fileTypeStats);
    const additions = labels.map(ext => this.fileTypeStats[ext].additions);
    const deletions = labels.map(ext => this.fileTypeStats[ext].deletions);
    this._chartInstance = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Additions',
            data: additions,
            backgroundColor: 'rgba(76, 175, 80, 0.7)', // Always green for additions
          },
          {
            label: 'Deletions',
            data: deletions,
            backgroundColor: 'rgba(244, 67, 54, 0.7)', // Always red for deletions
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          title: { display: false }
        },
        scales: {
          x: { title: { display: true, text: 'File Type' } },
          y: { title: { display: true, text: 'Lines Changed' }, beginAtZero: true }
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

customElements.define('pull-request-file-type-chart', PullRequestFileTypeChart);
