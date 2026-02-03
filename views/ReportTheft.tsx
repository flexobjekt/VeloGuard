import React, { useState } from 'react';
import { Bike, BikeStatus, TheftReport, UserProfile } from '../types';
import { generateTheftReport } from '../services/geminiService';
import { generatePDFReport } from '../services/pdfService';
import { GERMAN_POLICE_STATIONS } from '../services/policeData';
import { AlertTriangle, FileText, Send, MapPin, Loader2, Check, Download, ExternalLink, Globe } from 'lucide-react';

interface ReportTheftProps {
  bikes: Bike[];
  onReport: (report: TheftReport, bikeId: string) => void;
  // We need user profile for the PDF
  user?: UserProfile; 
}

// Mock user if not passed (though App.tsx should pass it ideally, adding fallback)
const DEFAULT_USER: UserProfile = {
  id: 'u1',
  name: 'Max Mustermann',
  dob: '01.01.1990',
  address: 'Musterstraße 1, 12345 Musterstadt',
  email: 'max@example.com'
};

export const ReportTheft: React.FC<ReportTheftProps> = ({ bikes, onReport, user = DEFAULT_USER }) => {
  const [selectedBikeId, setSelectedBikeId] = useState<string>('');
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');
  const [generatedReport, setGeneratedReport] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedState, setSelectedState] = useState<string>('');

  const safeBikes = bikes.filter(b => b.status === BikeStatus.SAFE || b.status === BikeStatus.FOR_SALE);
  const selectedPoliceStation = GERMAN_POLICE_STATIONS.find(p => p.state === selectedState);

  const handleGenerate = async () => {
    const bike = bikes.find(b => b.id === selectedBikeId);
    if (!bike || !location || !details) return;

    setIsGenerating(true);
    const reportText = await generateTheftReport(bike, details, location);
    setGeneratedReport(reportText);
    setIsGenerating(false);
    setStep(2);
  };

  const handleDownloadPDF = () => {
    const bike = bikes.find(b => b.id === selectedBikeId);
    if (!bike) return;
    
    // Create a temporary report object for the PDF function
    const tempReport: TheftReport = {
        id: 'temp',
        bikeId: bike.id,
        incidentDate: new Date().toISOString(),
        incidentTime: new Date().toLocaleTimeString(),
        location: location,
        details: details,
        policeReportStatus: 'PENDING',
        submissionDate: new Date().toISOString()
    };

    generatePDFReport(tempReport, bike, user, generatedReport, selectedState || 'Allgemein');
  };

  const handleOpenOnlinePolice = () => {
    if (selectedPoliceStation) {
      window.open(selectedPoliceStation.url, '_blank');
      handleConfirm(); // Auto confirm when leaving context
    }
  };

  const handleConfirm = () => {
    const report: TheftReport = {
      id: Math.random().toString(36).substr(2, 9),
      bikeId: selectedBikeId,
      incidentDate: new Date().toISOString(),
      incidentTime: new Date().toLocaleTimeString(),
      location,
      details,
      policeReportStatus: 'SUBMITTED',
      submissionDate: new Date().toISOString()
    };
    onReport(report, selectedBikeId);
    setStep(3);
  };

  if (step === 3) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <Check size={40} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Anzeige protokolliert</h2>
        <p className="text-gray-600 max-w-sm">
          Der Vorfall wurde in deinem VeloGuard Profil gespeichert. Falls du das Online-Portal der Polizei genutzt hast, bewahre bitte das Aktenzeichen gut auf.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
        >
          Zurück zur Übersicht
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start space-x-3">
        <AlertTriangle className="text-red-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-red-800 font-bold text-sm">Notfall-Modus: Diebstahlanzeige</h3>
          <p className="text-red-600 text-xs mt-1">
            Hier kannst du eine rechtssichere Anzeige generieren, als PDF herunterladen und direkt an die Onlinewache deines Bundeslandes weiterleiten.
          </p>
        </div>
      </div>

      {step === 1 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Betroffenes Fahrrad wählen</label>
            <select
              value={selectedBikeId}
              onChange={e => setSelectedBikeId(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white"
            >
              <option value="">-- Fahrrad auswählen --</option>
              {safeBikes.map(b => (
                <option key={b.id} value={b.id}>{b.make} {b.model} ({b.frameNumber})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ort des Diebstahls / Zuletzt gesehen</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                placeholder="z.B. Hauptbahnhof Berlin, Fahrradständer"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bundesland (für zuständige Polizei)</label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 text-gray-400" size={18} />
              <select
                value={selectedState}
                onChange={e => setSelectedState(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white appearance-none"
              >
                <option value="">-- Bundesland auswählen --</option>
                {GERMAN_POLICE_STATIONS.map(station => (
                    <option key={station.state} value={station.state}>{station.state}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Details zum Vorfall</label>
            <textarea
              rows={4}
              value={details}
              onChange={e => setDetails(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="Wann abgestellt? Wie lange weg? Welches Schloss? Aufbruchspuren? Zeugen?"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!selectedBikeId || !location || !details || !selectedState || isGenerating}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin mr-2" /> Generiere Anzeige...
              </>
            ) : (
              <>
                Anzeige erstellen & Prüfen
              </>
            )}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
          
          {/* Header */}
          <div className="flex justify-between items-start">
             <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <FileText className="mr-2 text-gray-500" /> Strafanzeige Entwurf
                </h3>
                <p className="text-sm text-gray-500">Bitte prüfe die Angaben, bevor du sie an die Polizei sendest.</p>
             </div>
             {selectedState && (
                 <div className="text-right text-xs bg-gray-50 px-3 py-1 rounded-lg">
                     <span className="text-gray-500">Zuständig:</span><br/>
                     <span className="font-bold">{selectedState}</span>
                 </div>
             )}
          </div>
          
          {/* Generated Text */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 font-mono text-xs text-gray-700 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
            {generatedReport}
          </div>

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-1 gap-4">
             {/* Primary Action: Download PDF */}
             <button
                onClick={handleDownloadPDF}
                className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-xl shadow-lg flex items-center justify-center transition group"
             >
                <div className="bg-gray-800 p-2 rounded-lg mr-3 group-hover:bg-gray-700 transition">
                    <Download size={24} />
                </div>
                <div className="text-left">
                    <div className="font-bold text-sm">PDF Herunterladen</div>
                    <div className="text-xs text-gray-400">Ausfüllbare, unterschriftsreife Version</div>
                </div>
             </button>

             {/* Secondary Action: Online Submission */}
             <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <div className="flex items-start mb-3">
                   <Globe className="text-blue-600 mr-3 mt-1" size={20} />
                   <div>
                       <h4 className="font-bold text-sm text-gray-900">Online Anzeige erstatten</h4>
                       <p className="text-xs text-gray-600 mt-1">
                           Nutze den generierten Text (PDF oder Copy-Paste) und reiche ihn direkt bei der Onlinewache ein.
                       </p>
                   </div>
                </div>
                {selectedPoliceStation ? (
                    <button 
                        onClick={handleOpenOnlinePolice}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg flex items-center justify-center transition"
                    >
                        <ExternalLink size={16} className="mr-2" />
                        Zur Onlinewache {selectedPoliceStation.state} öffnen
                    </button>
                ) : (
                    <div className="text-xs text-red-500">Bitte Bundesland im vorherigen Schritt wählen.</div>
                )}
             </div>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={() => setStep(1)}
              className="text-sm text-gray-500 hover:text-gray-900 underline"
            >
              Bearbeiten
            </button>
             <span className="mx-3 text-gray-300">|</span>
             <button
              onClick={handleConfirm}
              className="text-sm text-gray-500 hover:text-gray-900 underline"
            >
              Nur lokal speichern
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
