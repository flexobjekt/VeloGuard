import React, { useState, useRef } from 'react';
import { Bike, BikeStatus, BikeCondition, BikeDocument, Accessory, DocumentType } from '../types';
import { analyzeBikeImage, generateBikeDescription } from '../services/geminiService';
import { Camera, Loader2, Sparkles, Upload, FileText, Shield, Home, Trash2, Plus, Package, Fingerprint, Calendar, Euro, Settings } from 'lucide-react';

interface RegisterBikeProps {
  onRegister: (bike: Bike) => void;
  userId: string;
}

export const RegisterBike: React.FC<RegisterBikeProps> = ({ onRegister, userId }) => {
  const [loading, setLoading] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const insuranceDocInputRef = useRef<HTMLInputElement>(null);

  // Temporary state for new accessory input
  const [newAccessoryName, setNewAccessoryName] = useState('');
  const [newAccessoryDesc, setNewAccessoryDesc] = useState('');

  const [formData, setFormData] = useState<Partial<Bike>>({
    make: '',
    model: '',
    color: '',
    frameNumber: '',
    description: '',
    status: BikeStatus.SAFE,
    condition: 'NEU',
    purchaseDate: new Date().toISOString().split('T')[0],
    purchasePrice: undefined,
    storageLocation: '',
    insuranceProvider: '',
    insurancePolicyNumber: '',
    frameSize: '',
    tireSize: '',
    suspensionTravel: '',
    brakeType: '',
    documents: [],
    accessories: [],
    distinctiveFeatures: ''
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const result = event.target?.result as string;
      setPreviewImage(result);
      
      // Auto-analyze with Gemini
      setAiAnalyzing(true);
      try {
        const analysis = await analyzeBikeImage(result);
        setFormData(prev => ({
          ...prev,
          make: analysis.make || prev.make,
          model: analysis.model || prev.model,
          color: analysis.color || prev.color,
        }));
      } finally {
        setAiAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>, type: DocumentType) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const newDoc: BikeDocument = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: type,
        url: result,
        dateAdded: new Date().toISOString()
      };
      setFormData(prev => ({
        ...prev,
        documents: [...(prev.documents || []), newDoc]
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeDocument = (docId: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents?.filter(d => d.id !== docId)
    }));
  };

  const addAccessory = () => {
    if (!newAccessoryName) return;
    const newAccessory: Accessory = {
      id: Math.random().toString(36).substr(2, 9),
      name: newAccessoryName,
      description: newAccessoryDesc
    };
    setFormData(prev => ({
      ...prev,
      accessories: [...(prev.accessories || []), newAccessory]
    }));
    setNewAccessoryName('');
    setNewAccessoryDesc('');
  };

  const removeAccessory = (id: string) => {
    setFormData(prev => ({
      ...prev,
      accessories: prev.accessories?.filter(a => a.id !== id)
    }));
  };

  const handleGenerateDescription = async () => {
    if (!formData.make && !formData.model) return;
    setLoading(true);
    const desc = await generateBikeDescription(
      formData.make || '',
      formData.model || '',
      formData.color || '',
      formData.distinctiveFeatures || 'Standardkomponenten'
    );
    setFormData(prev => ({ ...prev, description: desc }));
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.make || !formData.frameNumber) return;

    const newBike: Bike = {
      id: Math.random().toString(36).substr(2, 9),
      ownerId: userId,
      frameNumber: formData.frameNumber!,
      make: formData.make!,
      model: formData.model || 'Unbekannt',
      color: formData.color || 'Unbekannt',
      description: formData.description || '',
      imageUrl: previewImage || undefined,
      status: BikeStatus.SAFE,
      purchaseDate: formData.purchaseDate || new Date().toISOString().split('T')[0],
      purchasePrice: formData.purchasePrice,
      condition: formData.condition || 'NEU',
      storageLocation: formData.storageLocation,
      insuranceProvider: formData.insuranceProvider,
      insurancePolicyNumber: formData.insurancePolicyNumber,
      frameSize: formData.frameSize,
      tireSize: formData.tireSize,
      suspensionTravel: formData.suspensionTravel,
      brakeType: formData.brakeType,
      documents: formData.documents || [],
      accessories: formData.accessories || [],
      distinctiveFeatures: formData.distinctiveFeatures || ''
    };

    onRegister(newBike);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Camera className="text-blue-600" />
          Fahrrad registrieren
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Fahrrad Foto</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-video rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition overflow-hidden"
            >
              {previewImage ? (
                <>
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    Klicken zum Ändern
                  </div>
                </>
              ) : (
                <>
                  <Upload className="text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Foto hochladen</span>
                  <span className="text-xs text-gray-400 mt-1">KI erkennt Details automatisch</span>
                </>
              )}
              {aiAnalyzing && (
                 <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                   <div className="flex flex-col items-center animate-pulse">
                     <Sparkles className="text-purple-600 mb-2" />
                     <span className="text-sm font-medium text-purple-700">Analysiere Bild...</span>
                   </div>
                 </div>
              )}
            </div>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageUpload} 
            />
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Marke</label>
              <input
                type="text"
                required
                value={formData.make}
                onChange={e => setFormData({...formData, make: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="z.B. Canyon"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Modell</label>
              <input
                type="text"
                value={formData.model}
                onChange={e => setFormData({...formData, model: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="z.B. Endurace"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Farbe</label>
              <input
                type="text"
                value={formData.color}
                onChange={e => setFormData({...formData, color: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="z.B. Matt Schwarz"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Rahmennummer</label>
              <input
                type="text"
                required
                value={formData.frameNumber}
                onChange={e => setFormData({...formData, frameNumber: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                placeholder="SN-12345678"
              />
            </div>
          </div>

          {/* Purchase Details */}
          <div className="border-t border-gray-100 pt-4 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center">
              <Euro size={16} className="mr-1 text-blue-600" /> Kaufdaten
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Kaufdatum</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 text-gray-400" size={14} />
                  <input
                    type="date"
                    max={new Date().toISOString().split('T')[0]}
                    value={formData.purchaseDate}
                    onChange={e => setFormData({...formData, purchaseDate: e.target.value})}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Kaufpreis (€)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.purchasePrice !== undefined ? formData.purchasePrice : ''}
                  onChange={e => setFormData({...formData, purchasePrice: e.target.value ? parseFloat(e.target.value) : undefined})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="0.00"
                />
                <p className="text-[10px] text-gray-400 mt-1">Wichtig für Versicherungsnachweise</p>
              </div>
            </div>
          </div>

          {/* Condition */}
          <div className="border-t border-gray-100 pt-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Zustand beim Kauf</label>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="radio" 
                  checked={formData.condition === 'NEU'} 
                  onChange={() => setFormData({...formData, condition: 'NEU'})}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium">Neu</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="radio" 
                  checked={formData.condition === 'GEBRAUCHT'} 
                  onChange={() => setFormData({...formData, condition: 'GEBRAUCHT'})}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium">Gebraucht</span>
              </label>
            </div>
          </div>

          {/* Storage Location - Dedicated Section */}
          <div className="border-t border-gray-100 pt-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center">
              <Home size={14} className="mr-1" /> Gewöhnlicher Abstellort
            </label>
            <input
              type="text"
              value={formData.storageLocation}
              onChange={e => setFormData({...formData, storageLocation: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="z.B. Garage zuhause, Fahrradkeller"
            />
          </div>

          {/* Insurance */}
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
              <Shield size={16} className="mr-1 text-blue-600" /> Versicherung
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Anbieter</label>
                <input
                  type="text"
                  value={formData.insuranceProvider}
                  onChange={e => setFormData({...formData, insuranceProvider: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="z.B. Allianz"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Policennummer</label>
                <input
                  type="text"
                  value={formData.insurancePolicyNumber}
                  onChange={e => setFormData({...formData, insurancePolicyNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono"
                  placeholder="POL-12345"
                />
              </div>
            </div>
            
             <div className="mt-3">
              <input
                ref={insuranceDocInputRef}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => handleDocumentUpload(e, 'INSURANCE')}
              />
              <button
                type="button"
                onClick={() => insuranceDocInputRef.current?.click()}
                className="text-xs flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                <Upload size={12} className="mr-1" />
                Versicherungsunterlagen hochladen
              </button>
            </div>
          </div>

          {/* Technical Details */}
          <div className="border-t border-gray-100 pt-4">
             <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
              <Settings size={16} className="mr-1 text-blue-600" /> Technische Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Rahmengröße</label>
                <input
                  type="text"
                  value={formData.frameSize}
                  onChange={e => setFormData({...formData, frameSize: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="z.B. L / 56cm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Reifengröße</label>
                <input
                  type="text"
                  value={formData.tireSize}
                  onChange={e => setFormData({...formData, tireSize: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder='z.B. 29" oder 700c'
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Federweg</label>
                <input
                  type="text"
                  value={formData.suspensionTravel}
                  onChange={e => setFormData({...formData, suspensionTravel: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="z.B. 140mm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Bremstyp</label>
                <input
                  type="text"
                  value={formData.brakeType}
                  onChange={e => setFormData({...formData, brakeType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="z.B. Scheibenbremse"
                />
              </div>
            </div>
          </div>

          {/* Distinctive Features */}
           <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
              <Fingerprint size={16} className="mr-1 text-blue-600" /> Besonderheiten & Merkmale
            </h3>
            <textarea
              rows={3}
              value={formData.distinctiveFeatures}
              onChange={e => setFormData({...formData, distinctiveFeatures: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              placeholder="z.B. Tiefer Kratzer am Oberrohr, Custom Aufkleber an der Gabel, Sattel leicht eingerissen..."
            />
          </div>

           {/* Accessories */}
           <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
              <Package size={16} className="mr-1 text-blue-600" /> Nachträgliches Zubehör
            </h3>
            
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newAccessoryName}
                onChange={e => setNewAccessoryName(e.target.value)}
                placeholder="Name (z.B. Tacho)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
              />
               <input
                type="text"
                value={newAccessoryDesc}
                onChange={e => setNewAccessoryDesc(e.target.value)}
                placeholder="Beschreibung"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none"
              />
              <button 
                type="button" 
                onClick={addAccessory}
                className="bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-800"
              >
                <Plus size={18} />
              </button>
            </div>

            {formData.accessories && formData.accessories.length > 0 && (
              <ul className="space-y-2 mb-2">
                {formData.accessories.map(acc => (
                  <li key={acc.id} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-100 text-sm">
                    <span><span className="font-semibold">{acc.name}:</span> {acc.description}</span>
                    <button type="button" onClick={() => removeAccessory(acc.id)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Documents */}
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
              <FileText size={16} className="mr-1 text-blue-600" /> Dokumente & Belege
            </h3>
            <div className="space-y-3">
              <input
                ref={docInputRef}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => handleDocumentUpload(e, 'RECEIPT_PURCHASE')}
              />
              <button
                type="button"
                onClick={() => docInputRef.current?.click()}
                className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-blue-300 hover:text-blue-600 transition flex items-center justify-center"
              >
                <Upload size={14} className="mr-2" />
                Kauf-/Verkaufsbeleg hochladen
              </button>
              
              {formData.documents && formData.documents.length > 0 && (
                <div className="space-y-2">
                  {formData.documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center overflow-hidden">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-blue-600 mr-3 shrink-0">
                           <FileText size={16} />
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-medium text-gray-900 truncate max-w-[150px]">{doc.name}</div>
                          <div className="text-[10px] text-gray-500 uppercase">
                            {doc.type === 'INSURANCE' ? 'Versicherung' : doc.type.replace('RECEIPT_', 'Beleg ')}
                          </div>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeDocument(doc.id)}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Description Generation */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase">Allgemeine Beschreibung</label>
              <button
                type="button"
                onClick={handleGenerateDescription}
                disabled={loading || !formData.make}
                className="text-xs flex items-center text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
              >
                {loading ? <Loader2 size={12} className="animate-spin mr-1" /> : <Sparkles size={12} className="mr-1" />}
                Auto-Text (KI)
              </button>
            </div>
            <textarea
              rows={4}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              placeholder="Zusammenfassender Text zum Fahrrad..."
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all active:scale-[0.98]"
          >
            Fahrrad registrieren
          </button>
        </form>
      </div>
    </div>
  );
};