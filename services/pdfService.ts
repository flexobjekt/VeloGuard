import { jsPDF } from "jspdf";
import { Bike, UserProfile, TheftReport } from "../types";

export const generatePDFReport = (
  report: TheftReport, 
  bike: Bike, 
  user: UserProfile, 
  aiReportText: string,
  state: string
) => {
  const doc = new jsPDF();
  const lineHeight = 7;
  let cursorY = 20;
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxLineWidth = pageWidth - margin * 2;

  // Header
  doc.setFontSize(10);
  doc.text(`${user.name}, ${user.address}`, margin, cursorY);
  cursorY += lineHeight;
  doc.text(`Geburtsdatum: ${user.dob}`, margin, cursorY);
  cursorY += lineHeight;
  doc.text(`Email: ${user.email}`, margin, cursorY);
  
  cursorY += 15;
  doc.setFont("helvetica", "bold");
  doc.text(`An die Polizeidienststelle (${state}) / Onlinewache`, margin, cursorY);
  
  cursorY += 15;
  const dateStr = new Date().toLocaleDateString('de-DE');
  doc.setFont("helvetica", "normal");
  doc.text(`Datum: ${dateStr}`, pageWidth - margin - 40, cursorY);

  cursorY += 15;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("STRAFANZEIGE / STRAFANTRAG", margin, cursorY);
  cursorY += 8;
  doc.setFontSize(12);
  doc.text("Wegen: Fahrraddiebstahl (Besonders schwerer Fall des Diebstahls)", margin, cursorY);

  cursorY += 15;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  // The AI generated text is usually well structured. We split it to fit page.
  const splitText = doc.splitTextToSize(aiReportText, maxLineWidth);
  
  // Check if text is too long for one page
  if (cursorY + splitText.length * 5 > 280) {
      // Simple pagination handling if needed, or just write what fits
      doc.text(splitText, margin, cursorY);
  } else {
      doc.text(splitText, margin, cursorY);
  }

  // Footer / Signature
  const finalY = Math.min(cursorY + (splitText.length * 5) + 20, 260);
  doc.text("__________________________________", margin, finalY);
  doc.text("Unterschrift (bei postalischem Versand)", margin, finalY + 5);

  doc.save(`Diebstahlanzeige_${bike.make}_${dateStr}.pdf`);
};
