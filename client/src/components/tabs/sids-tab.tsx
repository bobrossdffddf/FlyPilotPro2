import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sid } from "@shared/schema";
import { Input } from "@/components/ui/input";

export default function SidsTab() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: sids = [], isLoading } = useQuery<Sid[]>({
    queryKey: ["/api/sids", { search: searchQuery }],
  });

  return (
    <div className="h-full">
      <header className="bg-panel-bg border-b border-panel-gray p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-text-primary" data-testid="page-title">
              SIDs Database
            </h2>
            <p className="text-text-muted mt-1">Standard Instrument Departures by airport and runway</p>
          </div>
          <div className="flex items-center space-x-4">
            <Input
              type="text"
              placeholder="Search airport or runway..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-panel-gray border border-panel-gray text-text-primary placeholder-text-muted focus:ring-aviation-blue"
              data-testid="input-search-sids"
            />
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="bg-panel-bg rounded-xl border border-panel-gray p-6">
          {isLoading ? (
            <div className="text-center py-12" data-testid="loading-sids">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aviation-blue mx-auto mb-4"></div>
              <p className="text-text-secondary">Loading SIDs...</p>
            </div>
          ) : sids.length === 0 ? (
            <div className="text-center py-12" data-testid="empty-sids">
              <i className="fas fa-route text-6xl text-text-muted mb-4"></i>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {searchQuery ? "No SIDs Found" : "SIDs Database"}
              </h3>
              <p className="text-text-secondary">
                {searchQuery 
                  ? `No SIDs found matching "${searchQuery}"`
                  : "Searchable database of Standard Instrument Departures"
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="sids-list">
              {sids.map((sid) => (
                <div key={sid.id} className="bg-panel-gray/30 rounded-lg p-4 hover:bg-panel-gray/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-text-primary" data-testid={`sid-name-${sid.id}`}>
                      {sid.name}
                    </h4>
                    <span className="text-xs bg-aviation-blue/20 text-aviation-blue px-2 py-1 rounded font-mono">
                      {sid.airport}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary mb-2">{sid.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-muted">Runway {sid.runway}</span>
                    <button className="text-sm text-aviation-blue hover:text-aviation-blue/80 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
