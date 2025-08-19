import Gauge from "./Gauge"; // Assuming Gauge component is in the same directory

export default function InstrumentsTab() {
  return (
    <div className="h-full flex flex-col bg-cockpit-dark">
      {/* Header */}
      <div className="p-6 border-b border-panel-gray">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-nav-green/20">
              <Gauge className="text-nav-green" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-text-primary">
                Flight Instruments
              <span className="ml-2 px-2 py-1 text-xs bg-warning-orange/20 text-warning-orange rounded-lg">
                UNDER DEV
              </span>
            </h2>
            <p className="text-text-muted">
              Real-time cockpit instrument displays
            </p>
          </div>
        </div>
      </div>
    </div>

      {/* Coming Soon Message */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 rounded-full bg-aviation-blue/20 w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-tools text-aviation-blue text-4xl" />
          </div>
          <h3 className="text-2xl font-semibold text-text-primary mb-3">
            Coming Soon
          </h3>
          <p className="text-text-muted text-lg mb-2">
            Flight instruments and radar displays are under development
          </p>
          <p className="text-text-secondary">
            Check back soon for enhanced cockpit instrumentation
          </p>
        </div>
      </div>
    </div>
  );
}