import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Map, Upload, FileText, Download, Trash2, Maximize2, X, Search, Plus } from "lucide-react";

interface Chart {
  id: string;
  title: string;
  airportCode: string;
  chartType: string;
  fileName: string;
  fileUrl: string;
  createdAt: string;
}

interface PopoutChart {
  id: string;
  chart: Chart;
  position: { x: number; y: number };
}

const chartTypes = [
  "Approach Chart",
  "SID Chart", 
  "STAR Chart",
  "Airport Diagram",
  "Taxi Chart",
  "ILS Chart",
  "VOR Chart",
  "NDB Chart",
  "Area Chart",
  "Terminal Chart",
  "Departure Chart",
  "Arrival Chart",
  "Enroute Chart",
  "Visual Approach Chart",
  "Noise Abatement Chart",
  "Ground Movement Chart",
  "Parking Chart",
  "Hot Spots Chart",
  "Emergency Chart"
];

export default function EnhancedChartsTab() {
  const [popoutCharts, setPopoutCharts] = useState<PopoutChart[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChartType, setSelectedChartType] = useState<string>("all");
  const [uploadFormData, setUploadFormData] = useState({
    title: "",
    airportCode: "",
    chartType: "",
    fileName: "",
    fileUrl: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: charts = [] } = useQuery<Chart[]>({
    queryKey: ['/api/charts']
  });

  const createChartMutation = useMutation({
    mutationFn: async (chartData: Omit<Chart, 'id' | 'createdAt'>) => {
      return apiRequest('/api/charts', {
        method: 'POST',
        body: JSON.stringify(chartData)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/charts'] });
      setShowUploadForm(false);
      setUploadFormData({ title: "", airportCode: "", chartType: "", fileName: "", fileUrl: "" });
      toast({
        title: "Success",
        description: "Chart uploaded successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload chart",
        variant: "destructive"
      });
    }
  });

  const deleteChartMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/charts/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/charts'] });
      toast({
        title: "Success",
        description: "Chart deleted successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to delete chart",
        variant: "destructive"
      });
    }
  });

  const handlePopoutChart = (chart: Chart) => {
    const newPopout: PopoutChart = {
      id: `chart-${chart.id}-${Date.now()}`,
      chart,
      position: { x: Math.random() * 200, y: Math.random() * 200 }
    };
    setPopoutCharts(prev => [...prev, newPopout]);
  };

  const handleClosePopout = (id: string) => {
    setPopoutCharts(prev => prev.filter(p => p.id !== id));
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFormData.title || !uploadFormData.airportCode || !uploadFormData.chartType) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    createChartMutation.mutate(uploadFormData);
  };

  const filteredCharts = charts.filter(chart => {
    const matchesSearch = chart.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chart.airportCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedChartType === "all" || chart.chartType === selectedChartType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="h-full flex flex-col bg-cockpit-dark">
      {/* Header */}
      <div className="p-6 border-b border-panel-gray bg-gradient-to-r from-panel-bg to-panel-gray/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-nav-green/20">
              <Map className="text-nav-green" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-text-primary">
                Aviation Charts Library
              </h2>
              <p className="text-text-muted">
                Professional aviation charts with popout capabilities
              </p>
            </div>
          </div>
          <Button onClick={() => setShowUploadForm(true)} className="bg-aviation-blue hover:bg-aviation-blue/80">
            <Plus size={16} className="mr-2" />
            Add Chart
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Search size={16} className="text-text-muted" />
            <Input
              placeholder="Search charts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 bg-panel-bg border-panel-gray"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={selectedChartType} onValueChange={setSelectedChartType}>
              <SelectTrigger className="w-48 bg-panel-bg border-panel-gray">
                <SelectValue placeholder="Chart Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Chart Types</SelectItem>
                {chartTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filteredCharts.map((chart, index) => (
              <motion.div
                key={chart.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg bg-panel-bg border-panel-gray hover:border-aviation-blue/40">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-text-primary group-hover:text-aviation-blue transition-colors">
                          {chart.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {chart.airportCode}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {chart.chartType}
                          </Badge>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePopoutChart(chart);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Maximize2 size={16} />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="bg-black/30 rounded-lg h-32 flex items-center justify-center mb-4">
                      {chart.fileUrl ? (
                        <img 
                          src={chart.fileUrl} 
                          alt={chart.title}
                          className="max-w-full max-h-full object-contain rounded"
                        />
                      ) : (
                        <div className="text-center">
                          <FileText size={32} className="text-text-muted mx-auto mb-2" />
                          <p className="text-xs text-text-muted">{chart.fileName || "No preview"}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-text-muted">
                        {new Date(chart.createdAt).toLocaleDateString()}
                      </span>
                      
                      <div className="flex gap-1">
                        {chart.fileUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(chart.fileUrl, '_blank');
                            }}
                          >
                            <Download size={14} />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteChartMutation.mutate(chart.id);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredCharts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Map size={48} className="text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">
              No charts found
            </h3>
            <p className="text-text-muted mb-4">
              Try adjusting your search or add some charts to get started
            </p>
            <Button onClick={() => setShowUploadForm(true)}>
              <Plus size={16} className="mr-2" />
              Add First Chart
            </Button>
          </motion.div>
        )}
      </div>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-panel-bg border border-panel-gray rounded-lg p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-text-primary">Add New Chart</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUploadForm(false)}
              >
                <X size={16} />
              </Button>
            </div>
            
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-text-primary">Chart Title *</Label>
                <Input
                  id="title"
                  value={uploadFormData.title}
                  onChange={(e) => setUploadFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., KJFK ILS RWY 04L"
                  className="bg-panel-bg border-panel-gray"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="airportCode" className="text-text-primary">Airport Code *</Label>
                <Input
                  id="airportCode"
                  value={uploadFormData.airportCode}
                  onChange={(e) => setUploadFormData(prev => ({ ...prev, airportCode: e.target.value.toUpperCase() }))}
                  placeholder="e.g., KJFK"
                  className="bg-panel-bg border-panel-gray"
                  maxLength={4}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="chartType" className="text-text-primary">Chart Type *</Label>
                <Select 
                  value={uploadFormData.chartType}
                  onValueChange={(value) => setUploadFormData(prev => ({ ...prev, chartType: value }))}
                  required
                >
                  <SelectTrigger className="bg-panel-bg border-panel-gray">
                    <SelectValue placeholder="Select chart type" />
                  </SelectTrigger>
                  <SelectContent>
                    {chartTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="fileUrl" className="text-text-primary">Chart Image URL</Label>
                <Input
                  id="fileUrl"
                  value={uploadFormData.fileUrl}
                  onChange={(e) => setUploadFormData(prev => ({ ...prev, fileUrl: e.target.value }))}
                  placeholder="https://example.com/chart.png"
                  className="bg-panel-bg border-panel-gray"
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowUploadForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createChartMutation.isPending}
                  className="bg-aviation-blue hover:bg-aviation-blue/80"
                >
                  {createChartMutation.isPending ? "Adding..." : "Add Chart"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Popout Charts */}
      <AnimatePresence>
        {popoutCharts.map((popout) => (
          <PopoutChartDisplay
            key={popout.id}
            chart={popout.chart}
            onClose={() => handleClosePopout(popout.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function PopoutChartDisplay({ chart, onClose }: { chart: Chart; onClose: () => void }) {
  return (
    <motion.div
      className="fixed top-20 left-20 w-[800px] h-[600px] z-50"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      drag
      dragMomentum={false}
    >
      <Card className="bg-black/95 border-aviation-blue/30 shadow-2xl h-full">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-nav-green text-lg">{chart.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {chart.airportCode}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {chart.chartType}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-red-500/20"
            >
              <X size={16} />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden">
          <div className="w-full h-full bg-black/20 rounded-lg overflow-auto">
            {chart.fileUrl ? (
              <img 
                src={chart.fileUrl} 
                alt={chart.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <FileText size={48} className="text-text-muted mx-auto mb-4" />
                  <p className="text-text-muted">No chart image available</p>
                  <p className="text-sm text-text-muted mt-2">{chart.fileName}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}