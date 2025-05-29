import { LitElement, html, css } from 'lit';
import Chart from 'chart.js/auto';

/**
 * Web component for visualizing combined line changes by file type for a contributor.
 *
 * @element contributor-filetype-changes-chart
 * @property {Object} fileTypeStats - Object { ext: { additions, deletions, count } }
 * @property {String} contributor - Contributor username
 */
export class ContributorFiletypeChangesChart extends LitElement {
  static properties = {
    fileTypeStats: { type: Object },
    contributor: { type: String }
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
    this.contributor = '';
    this._chartInstance = null;
  }

  render() {
    return html`<canvas id="chart-filetype-${this.contributor}" width="700" height="240"></canvas>`;
  }

  updated() {
    this.renderChart();
  }

  renderChart() {
    const canvas = this.renderRoot.querySelector('canvas');
    if (!canvas || !this.fileTypeStats || Object.keys(this.fileTypeStats).length === 0) return;
    if (this._chartInstance) {
      this._chartInstance.destroy();
      this._chartInstance = null;
    }
    // Only show selected file types
    const allowed = ['js', 'html', 'css', 'java', 'md'];
    const labels = Object.keys(this.fileTypeStats).filter(ext => allowed.includes(ext));
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
            backgroundColor: 'rgba(76, 175, 80, 0.7)',
          },
          {
            label: 'Deletions',
            data: deletions,
            backgroundColor: 'rgba(244, 67, 54, 0.7)',
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

customElements.define('contributor-filetype-changes-chart', ContributorFiletypeChangesChart);
