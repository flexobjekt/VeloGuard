import { GoogleGenAI } from "@google/genai";
import { Bike } from '../types';

const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateBikeDescription = async (make: string, model: string, color: string, features: string): Promise<string> => {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Schreibe eine professionelle und detaillierte Beschreibung für eine Fahrrad-Registrierungsdatenbank auf Deutsch.
      Fahrrad Details:
      Marke: ${make}
      Modell: ${model}
      Farbe: ${color}
      Besondere Merkmale: ${features}
      
      Halte dich an Fakten, sei prägnant (unter 100 Wörter) und nutze Sprache, die für eine polizeiliche Identifizierung geeignet ist.`,
    });
    return response.text || "Beschreibung nicht verfügbar.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Konnte Beschreibung nicht automatisch generieren.";
  }
};

export const analyzeBikeImage = async (base64Image: string): Promise<Partial<Bike>> => {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image.split(',')[1] // Remove data URL prefix
            }
          },
          {
            text: "Analysiere dieses Fahrradbild. Extrahiere wahrscheinlich Marke, Modell (falls sichtbar), Farbe und Typ. Antworte als JSON mit den Schlüsseln: make, model, color, type."
          }
        ]
      },
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) return {};
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Image Analysis Error:", error);
    return {};
  }
};

export const generateTheftReport = async (bike: Bike, incidentDetails: string, location: string): Promise<string> => {
  const ai = getAiClient();
  try {
    const insuranceInfo = bike.insuranceProvider 
      ? `Versicherung: ${bike.insuranceProvider} (Police: ${bike.insurancePolicyNumber || 'N/A'})` 
      : 'Versicherung: Keine Angabe';

    const storageInfo = bike.storageLocation 
      ? `Gewöhnlicher Abstellort: ${bike.storageLocation}` 
      : '';

    const purchaseInfo = `Kaufdaten: Datum ${bike.purchaseDate}, Preis ${bike.purchasePrice ? bike.purchasePrice + ' EUR' : 'k.A.'}, Zustand beim Kauf: ${bike.condition}`;
    
    const accessoriesList = bike.accessories.length > 0 
      ? bike.accessories.map(a => `- ${a.name}: ${a.description}`).join('\n')
      : 'Kein besonderes Zubehör gelistet.';

    const featuresInfo = bike.distinctiveFeatures || 'Keine besonderen Merkmale angegeben.';

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using Pro for more formal reasoning
      contents: `Erstelle den Entwurf einer formellen Diebstahlanzeige für die Polizei (auf Deutsch) für das folgende Fahrrad.
      
      Eigentümer Details: [Ausgeblendet für Entwurf]
      
      Fahrzeugdaten:
      Marke: ${bike.make}
      Modell: ${bike.model}
      Rahmennummer: ${bike.frameNumber}
      Farbe: ${bike.color}
      Beschreibung: ${bike.description}
      ${purchaseInfo}
      ${storageInfo}
      
      Besondere Identifikationsmerkmale (WICHTIG):
      ${featuresInfo}

      Nachträglich angebrachtes Zubehör:
      ${accessoriesList}
      
      Finanzieller/Rechtlicher Kontext:
      ${insuranceInfo}
      
      Tathergang:
      Ort: ${location}
      Details: ${incidentDetails}
      
      Formatiere dies als formelles Schreiben oder Protokoll, das direkt an eine Polizeidienststelle in Deutschland übermittelt werden kann. Verwende amtliche, sachliche Sprache.`
    });
    return response.text || "Bericht konnte nicht erstellt werden.";
  } catch (error) {
    console.error("Gemini Report Error:", error);
    return "Konnte keinen formellen Bericht generieren.";
  }
};
