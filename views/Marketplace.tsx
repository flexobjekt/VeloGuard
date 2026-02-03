import React, { useState } from 'react';
import { Bike, BikeStatus, DealerAd } from '../types';
import { ShoppingBag, Search, Filter, Megaphone, X, Store, ExternalLink } from 'lucide-react';

interface MarketplaceProps {
  bikes: Bike[];
  ads: DealerAd[];
  userId: string;
  onBuy: (bikeId: string) => void;
  onCreateAd: (ad: DealerAd) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ bikes, ads, userId, onBuy, onCreateAd }) => {
  const [filter, setFilter] = useState('');
  const [showAdForm, setShowAdForm] = useState(false);
  
  // Ad Form State
  const [newAd, setNewAd] = useState<Partial<DealerAd>>({
    dealerName: '',
    title: '',
    description: '',
    price: ''
  });

  const listings = bikes.filter(b => 
    b.status === BikeStatus.FOR_SALE && 
    (b.make.toLowerCase().includes(filter.toLowerCase()) || b.model.toLowerCase().includes(filter.toLowerCase()))
  );

  const handleSubmitAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAd.dealerName || !newAd.title || !newAd.description) return;

    onCreateAd({
      id: Math.random().toString(36).substr(2, 9),
      dealerName: newAd.dealerName!,
      title: newAd.title!,
      description: newAd.description!,
      price: newAd.price,
      imageUrl: 'https://picsum.photos/seed/ad' + Math.random() + '/400/300' // Mock image
    });
    setShowAdForm(false);
    setNewAd({ dealerName: '', title: '', description: '', price: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-bold text-gray-900">Marktplatz</h2>
           <p className="text-xs text-gray-500">Gebrauchträder & Händler-Angebote</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => setShowAdForm(!showAdForm)}
             className="p-2 bg-yellow-100 text-yellow-800 rounded-lg text-xs font-bold flex items-center hover:bg-yellow-200 transition"
           >
              <Megaphone size={16} className="mr-1" />
              Für Händler
           </button>
           <div className="p-2 bg-gray-100 rounded-lg">
              <Filter size={20} className="text-gray-600" />
           </div>
        </div>
      </div>

      {/* Dealer Ad Form Modal/Overlay */}
      {showAdForm && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl relative animation-fade-in">
          <button 
            onClick={() => setShowAdForm(false)}
            className="absolute top-2 right-2 text-yellow-800 hover:text-yellow-900"
          >
            <X size={20} />
          </button>
          <h3 className="font-bold text-yellow-900 mb-4 flex items-center">
            <Store className="mr-2" size={20} />
            Werbeanzeige erstellen
          </h3>
          <form onSubmit={handleSubmitAd} className="space-y-3">
            <input 
              type="text" 
              placeholder="Name des Fahrradgeschäfts"
              required
              className="w-full px-3 py-2 rounded-lg border border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={newAd.dealerName}
              onChange={e => setNewAd({...newAd, dealerName: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="Titel (z.B. Winterservice Aktion)"
              required
              className="w-full px-3 py-2 rounded-lg border border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={newAd.title}
              onChange={e => setNewAd({...newAd, title: e.target.value})}
            />
            <textarea 
              placeholder="Beschreibung des Angebots..."
              required
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={newAd.description}
              onChange={e => setNewAd({...newAd, description: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="Preis Text (Optional, z.B. 'nur 49€')"
              className="w-full px-3 py-2 rounded-lg border border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              value={newAd.price}
              onChange={e => setNewAd({...newAd, price: e.target.value})}
            />
            <button type="submit" className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold rounded-lg shadow-sm">
              Kostenpflichtig buchen
            </button>
          </form>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Fahrräder suchen..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Render Dealer Ads First */}
        {ads.map(ad => (
           <div key={ad.id} className="bg-yellow-50 rounded-xl shadow-sm border border-yellow-200 overflow-hidden relative">
              <div className="absolute top-2 right-2 z-10">
                 <span className="bg-yellow-300 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                   ANZEIGE
                 </span>
              </div>
              <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
                 <img 
                    src={ad.imageUrl} 
                    alt={ad.title} 
                    className="w-full h-full object-cover" 
                 />
              </div>
              <div className="p-4">
                <div className="flex items-center text-xs font-bold text-yellow-800 mb-1">
                   <Store size={12} className="mr-1" />
                   {ad.dealerName}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{ad.title}</h3>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{ad.description}</p>
                <div className="flex justify-between items-center mt-2">
                   <span className="font-bold text-lg text-gray-900">{ad.price}</span>
                   <button className="text-xs font-medium bg-white border border-yellow-300 px-3 py-1.5 rounded-lg flex items-center hover:bg-yellow-100">
                     Zum Angebot <ExternalLink size={12} className="ml-1" />
                   </button>
                </div>
              </div>
           </div>
        ))}

        {/* Render Bike Listings */}
        {listings.length === 0 && ads.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500">
            Aktuell keine Räder zum Verkauf.
          </div>
        ) : (
          listings.map(bike => (
            <div key={bike.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
              <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
                 {bike.imageUrl ? (
                    <img 
                      src={bike.imageUrl} 
                      alt={bike.model} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <ShoppingBag size={32} />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-900 shadow-sm">
                    Verifiziert
                  </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 truncate pr-2">{bike.make} {bike.model}</h3>
                  <span className="font-bold text-blue-600 whitespace-nowrap">
                    {bike.price ? `${bike.price} €` : 'VB'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{bike.description}</p>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="text-xs text-gray-400 font-mono">
                    ID: {bike.frameNumber.slice(0, 8)}...
                  </div>
                  {bike.ownerId !== userId && (
                    <button 
                      onClick={() => onBuy(bike.id)}
                      className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition"
                    >
                      Angebot machen
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
