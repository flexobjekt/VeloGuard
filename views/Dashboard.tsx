import React, { useState } from 'react';
import { Bike, BikeStatus } from '../types';
import { AlertTriangle, CheckCircle, Tag, Shield, Home, FileText, ChevronDown, ChevronUp, Package, Fingerprint, Calendar, Euro } from 'lucide-react';

interface DashboardProps {
  bikes: Bike[];
  onManage: (bikeId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ bikes, onManage }) => {
  const [expandedBike, setExpandedBike] = useState<string | null>(null);

  const getStatusColor = (status: BikeStatus) => {
    switch (status) {
      case BikeStatus.SAFE: return 'bg-green-100 text-green-800 border-green-200';
      case BikeStatus.STOLEN: return 'bg-red-100 text-red-800 border-red-200';
      case BikeStatus.FOR_SALE: return 'bg-blue-100 text-blue-800 border-blue-200';
      case BikeStatus.SOLD: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedBike(expandedBike === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Meine Garage</h2>
          <p className="text-gray-500 text-sm">Verwalte deine registrierten Fahrräder</p>
        </div>
        <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded-full">{bikes.length} Räder</span>
      </div>

      {bikes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
          <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Tag className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Keine Fahrräder registriert</h3>
          <p className="text-gray-500 mt-1 max-w-xs mx-auto">Registriere dein erstes Fahrrad, um es zu schützen und Diebstahlanzeigen zu generieren.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {bikes.map(bike => (
            <div key={bike.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex">
                <div className="w-1/3 bg-gray-200 relative min-h-[140px]">
                  {bike.imageUrl ? (
                    <img src={bike.imageUrl} alt={bike.model} className="w-full h-full object-cover absolute inset-0" />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full text-gray-400">
                      <Tag size={24} />
                    </div>
                  )}
                  {bike.condition === 'NEU' && (
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded">
                      NEU
                    </div>
                  )}
                </div>
                <div className="w-2/3 p-4 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{bike.make} {bike.model}</h3>
                      <p className="text-xs text-gray-500 font-mono">RN: {bike.frameNumber}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${getStatusColor(bike.status)}`}>
                      {bike.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{bike.description}</p>
                  
                  <div className="mt-auto flex justify-between items-center">
                    <div className="flex gap-2">
                      {bike.status === BikeStatus.STOLEN ? (
                         <div className="flex items-center text-xs text-red-600 font-medium">
                           <AlertTriangle size={14} className="mr-1" /> Gemeldet
                         </div>
                      ) : (
                         <div className="flex items-center text-xs text-green-600 font-medium">
                           <CheckCircle size={14} className="mr-1" /> Geschützt
                         </div>
                      )}
                    </div>
                    <button 
                      onClick={() => toggleExpand(bike.id)}
                      className="text-gray-400 hover:text-gray-600 p-1 flex items-center text-xs"
                    >
                      Details {expandedBike === bike.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedBike === bike.id && (
                <div className="bg-gray-50 border-t border-gray-100 p-4 space-y-4 text-sm">
                  
                  {/* Row 1: Insurance & Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                        <Shield size={14} className="mr-1.5" /> Versicherung & Ort
                      </h4>
                      <div className="space-y-1 bg-white p-2 rounded border border-gray-100">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Anbieter:</span>
                          <span className="font-medium text-gray-900">{bike.insuranceProvider || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Police:</span>
                          <span className="font-mono text-gray-900">{bike.insurancePolicyNumber || '-'}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-dashed border-gray-100 mt-1">
                          <span className="text-gray-500 flex items-center"><Home size={12} className="mr-1"/> Abstellort:</span>
                          <span className="font-medium text-gray-900">{bike.storageLocation || 'Unbekannt'}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                        <FileText size={14} className="mr-1.5" /> Daten & Dokumente
                      </h4>
                      <div className="mb-2 space-y-1">
                         <div className="flex items-center justify-between text-xs text-gray-600">
                             <span className="flex items-center"><Calendar size={12} className="mr-1"/> Kaufdatum:</span>
                             <span className="font-medium">{bike.purchaseDate ? new Date(bike.purchaseDate).toLocaleDateString('de-DE') : '-'}</span>
                         </div>
                         <div className="flex items-center justify-between text-xs text-gray-600">
                             <span className="flex items-center"><Euro size={12} className="mr-1"/> Kaufpreis:</span>
                             <span className="font-medium">{bike.purchasePrice ? bike.purchasePrice.toFixed(2) + ' €' : '-'}</span>
                         </div>
                      </div>
                      
                      {bike.documents.length === 0 ? (
                        <span className="text-xs text-gray-400 italic">Keine Dokumente vorhanden.</span>
                      ) : (
                        <div className="space-y-2">
                          {bike.documents.map(doc => (
                            <div key={doc.id} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                               <div className="flex items-center overflow-hidden">
                                 <FileText size={12} className="text-blue-500 mr-2 shrink-0" />
                                 <span className="text-xs truncate max-w-[120px]">{doc.name}</span>
                               </div>
                               <span className="text-[9px] uppercase font-bold text-gray-400">{doc.type.split('_')[1] || 'DOC'}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Features & Accessories */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                          <Fingerprint size={14} className="mr-1.5" /> Besonderheiten
                        </h4>
                        <div className="bg-white p-2 rounded border border-gray-100 text-xs text-gray-600 min-h-[60px]">
                           {bike.distinctiveFeatures ? bike.distinctiveFeatures : 'Keine Besonderheiten angegeben.'}
                        </div>
                     </div>
                     <div>
                        <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                          <Package size={14} className="mr-1.5" /> Zubehör
                        </h4>
                        <div className="bg-white p-2 rounded border border-gray-100 text-xs text-gray-600 min-h-[60px]">
                           {bike.accessories.length > 0 ? (
                             <ul className="list-disc list-inside space-y-1">
                               {bike.accessories.map(acc => (
                                 <li key={acc.id}><span className="font-medium">{acc.name}:</span> {acc.description}</li>
                               ))}
                             </ul>
                           ) : 'Kein Zubehör gelistet.'}
                        </div>
                     </div>
                  </div>

                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
