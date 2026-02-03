import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './views/Dashboard';
import { RegisterBike } from './views/RegisterBike';
import { ReportTheft } from './views/ReportTheft';
import { Marketplace } from './views/Marketplace';
import { Bike, BikeStatus, UserProfile, TheftReport, ViewState, DealerAd } from './types';
import { User, MapPin, Calendar, ShoppingBag } from 'lucide-react';

const MOCK_USER: UserProfile = {
  id: 'user-1',
  name: 'Max Mustermann',
  dob: '12.04.1985',
  address: 'Berliner Str. 42, 10115 Berlin',
  email: 'max@example.com'
};

const INITIAL_ADS: DealerAd[] = [
  {
    id: 'ad1',
    dealerName: 'Radprofis Berlin',
    title: 'Großer Winter-Check',
    description: 'Wir machen dein Bike fit für die kalte Jahreszeit. Inspektion inkl. Lichtcheck.',
    imageUrl: 'https://picsum.photos/seed/ad1/400/300',
    price: 'nur 49€'
  }
];

const INITIAL_BIKES: Bike[] = [
  {
    id: 'b1',
    ownerId: 'user-1',
    frameNumber: 'WSBC6010',
    make: 'Specialized',
    model: 'Tarmac SL7',
    color: 'Rot/Schwarz',
    description: 'Carbon Rennrad mit Shimano Ultegra Di2 Schaltung. Leichter Kratzer am Oberrohr.',
    imageUrl: 'https://picsum.photos/seed/bike1/400/300',
    status: BikeStatus.SAFE,
    purchaseDate: '2023-05-10',
    purchasePrice: 4299.00,
    condition: 'NEU',
    storageLocation: 'Kellerabteil 4',
    insuranceProvider: 'Allianz',
    insurancePolicyNumber: 'DE-99283-X',
    documents: [
      {
        id: 'd1',
        name: 'rechnung_specialized.pdf',
        type: 'RECEIPT_PURCHASE',
        url: '#',
        dateAdded: '2023-05-10T10:00:00Z'
      }
    ],
    accessories: [
      { id: 'a1', name: 'Wahoo Halterung', description: 'Aero Mount am Lenker' },
      { id: 'a2', name: 'Flaschenhalter', description: '2x Carbon Schwarz' }
    ],
    distinctiveFeatures: 'Kleiner Lackabplatzer an der Kettenstrebe rechts.'
  },
  {
    id: 'b2',
    ownerId: 'other-user',
    frameNumber: 'CANYON882',
    make: 'Canyon',
    model: 'Grizl CF',
    color: 'Grau',
    description: 'Gravelbike für Bikepacking vorbereitet. Inklusive Rahmentaschen.',
    imageUrl: 'https://picsum.photos/seed/bike2/400/300',
    status: BikeStatus.FOR_SALE,
    purchaseDate: '2022-08-15',
    purchasePrice: 2400.00,
    price: 2400,
    condition: 'GEBRAUCHT',
    storageLocation: 'Garage',
    documents: [],
    accessories: [],
    distinctiveFeatures: ''
  }
];

export default function App() {
  const [currentView, setView] = useState<ViewState>('DASHBOARD');
  const [user, setUser] = useState<UserProfile>(MOCK_USER);
  const [bikes, setBikes] = useState<Bike[]>(INITIAL_BIKES);
  const [ads, setAds] = useState<DealerAd[]>(INITIAL_ADS);
  const [reports, setReports] = useState<TheftReport[]>([]);

  const handleRegisterBike = (newBike: Bike) => {
    setBikes([newBike, ...bikes]);
    setView('DASHBOARD');
  };

  const handleReportTheft = (report: TheftReport, bikeId: string) => {
    setReports([...reports, report]);
    setBikes(bikes.map(b => b.id === bikeId ? { ...b, status: BikeStatus.STOLEN } : b));
  };

  const handleCreateAd = (ad: DealerAd) => {
    setAds([ad, ...ads]);
  };

  const handleBuy = (bikeId: string) => {
    // In a real app, this would trigger a transaction flow.
    alert(`Angebot für Rad ${bikeId} gesendet`);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return <Dashboard bikes={bikes.filter(b => b.ownerId === user.id)} onManage={() => {}} />;
      case 'REGISTER':
        return <RegisterBike onRegister={handleRegisterBike} userId={user.id} />;
      case 'REPORT':
        return <ReportTheft bikes={bikes.filter(b => b.ownerId === user.id)} onReport={handleReportTheft} user={user} />;
      case 'MARKET':
        return <Marketplace bikes={bikes} ads={ads} userId={user.id} onBuy={handleBuy} onCreateAd={handleCreateAd} />;
      case 'PROFILE':
        const userBikesForSale = bikes.filter(b => b.ownerId === user.id && b.status === BikeStatus.FOR_SALE);
        
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <User size={32} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-500 text-sm">{user.email}</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-bold text-gray-900">Persönliche Daten</h3>
              <div className="grid gap-4">
                <div className="flex items-center text-gray-600">
                  <Calendar size={18} className="mr-3 text-gray-400" />
                  <span>Geboren: {user.dob}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin size={18} className="mr-3 text-gray-400" />
                  <span>{user.address}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl">
               <h4 className="font-bold text-blue-900 mb-2">Meine Statistik</h4>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{bikes.filter(b => b.ownerId === user.id).length}</div>
                    <div className="text-xs text-gray-500">Registrierte Räder</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-500">{reports.length}</div>
                    <div className="text-xs text-gray-500">Meldungen</div>
                  </div>
               </div>
            </div>

            {/* My Marketplace Listings */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-bold text-gray-900 flex items-center">
                <ShoppingBag size={18} className="mr-2 text-blue-600" />
                Meine Marktplatz-Angebote
              </h3>
              
              {userBikesForSale.length === 0 ? (
                <p className="text-sm text-gray-500 italic py-2">Du hast aktuell keine Fahrräder zum Verkauf eingestellt.</p>
              ) : (
                <div className="grid gap-3">
                  {userBikesForSale.map(bike => (
                    <div key={bike.id} className="flex items-center p-3 border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="w-14 h-14 bg-gray-200 rounded-md overflow-hidden shrink-0 mr-3">
                         {bike.imageUrl ? (
                           <img src={bike.imageUrl} alt={bike.model} className="w-full h-full object-cover" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-gray-400"><ShoppingBag size={14}/></div>
                         )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-gray-900 truncate">{bike.make} {bike.model}</h4>
                        <div className="flex items-center text-xs text-gray-500 mt-0.5">
                          <span className="font-bold text-blue-600 mr-2">{bike.price ? bike.price.toFixed(2) + ' €' : 'VB'}</span>
                        </div>
                      </div>
                      <div className="ml-2">
                         <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full uppercase border border-green-200">
                           Aktiv
                         </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      default:
        return <Dashboard bikes={bikes.filter(b => b.ownerId === user.id)} onManage={() => {}} />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setView}>
      {renderContent()}
    </Layout>
  );
}
