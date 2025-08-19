export default function ChartsTab() {
  return (
    <div className="h-full">
      <header className="bg-panel-bg border-b border-panel-gray p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-text-primary" data-testid="page-title">
              Aviation Charts
            </h2>
            <p className="text-text-muted mt-1">Interactive aviation charts and navigation aids</p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              className="bg-aviation-blue hover:bg-aviation-blue/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              data-testid="button-upload-chart"
            >
              <i className="fas fa-upload mr-2"></i>Upload Chart
            </button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="bg-panel-bg rounded-xl border border-panel-gray h-96 flex items-center justify-center">
          <div className="text-center" data-testid="charts-placeholder">
            <i className="fas fa-map text-6xl text-text-muted mb-4"></i>
            <h3 className="text-lg font-semibold text-text-primary mb-2">Chart Viewer</h3>
            <p className="text-text-secondary">Interactive chart display with zoom and pan capabilities</p>
            <p className="text-sm text-text-muted mt-2">Upload charts to get started</p>
          </div>
        </div>
      </div>
    </div>
  );
}
