export interface PoliceStation {
  state: string;
  name: string;
  url: string;
  email?: string;
}

export const GERMAN_POLICE_STATIONS: PoliceStation[] = [
  { state: "Baden-Württemberg", name: "Onlinewache Polizei BW", url: "https://www.polizei-bw.de/onlinewache/" },
  { state: "Bayern", name: "Bayerische Polizei - Anzeige", url: "https://www.polizei.bayern.de/service/anzeige-erstatten/index.html" },
  { state: "Berlin", name: "Internetwache Polizei Berlin", url: "https://www.internetwache-polizei-berlin.de/" },
  { state: "Brandenburg", name: "Internetwache Brandenburg", url: "https://polizei.brandenburg.de/onlineservice/anzeige" },
  { state: "Bremen", name: "Onlinewache Bremen", url: "https://www.onlinewache.bremen.de/" },
  { state: "Hamburg", name: "Onlinewache Hamburg", url: "https://www.polizei.hamburg/onlinewache" },
  { state: "Hessen", name: "Onlinewache Hessen", url: "https://ppffm.polizei.hessen.de/Ueber-uns/Ansprechpartner/Onlinewache/" },
  { state: "Mecklenburg-Vorpommern", name: "Internetwache MV", url: "https://www.polizei.mvnet.de/Onlinewache/" },
  { state: "Niedersachsen", name: "Onlinewache Niedersachsen", url: "https://www.onlinewache.polizei.niedersachsen.de/" },
  { state: "Nordrhein-Westfalen", name: "Internetwache NRW", url: "https://service.polizei.nrw.de/anzeige" },
  { state: "Rheinland-Pfalz", name: "Onlinewache RLP", url: "https://www.polizei.rlp.de/de/onlinewache/" },
  { state: "Saarland", name: "Onlinewache Saarland", url: "https://www.saarland.de/polizei/DE/onlinewache/onlinewache_node.html" },
  { state: "Sachsen", name: "Onlinewache Sachsen", url: "https://www.polizei.sachsen.de/de/onlinewache.htm" },
  { state: "Sachsen-Anhalt", name: "E-Revier Sachsen-Anhalt", url: "https://polizei.sachsen-anhalt.de/das-sind-wir/e-revier/" },
  { state: "Schleswig-Holstein", name: "Onlinewache SH", url: "https://www.schleswig-holstein.de/DE/Landesregierung/POLIZEI/Polizeistationen/Onlinewache/onlinewache_node.html" },
  { state: "Thüringen", name: "Onlinewache Thüringen", url: "https://polizei.thueringen.de/landespolizeiinspektionen/onlinewache" }
];

export const getPoliceStationByState = (state: string) => {
  return GERMAN_POLICE_STATIONS.find(p => p.state === state);
};
