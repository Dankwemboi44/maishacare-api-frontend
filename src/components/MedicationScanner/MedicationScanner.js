// src/components/MedicationScanner/MedicationScanner.js
import React, { useState } from 'react';
import './MedicationScanner.css';

const MedicationScanner = ({ onAddMedication }) => {
  const [scanning, setScanning] = useState(false);
  const [scannedMed, setScannedMed] = useState(null);

  const startScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScannedMed({ name: 'Lisinopril', dosage: '10mg', manufacturer: 'Pfizer', expiry: '2026-12-31' });
      setScanning(false);
    }, 2000);
  };

  const addToPrescriptions = () => { if (scannedMed) onAddMedication(scannedMed); alert('Medication added to your prescriptions!'); setScannedMed(null); };

  return (
    <div className="medication-scanner">
      <div className="scanner-header"><h2><i className="fas fa-camera"></i> Medication Scanner</h2><p>Scan barcode on medication package</p></div>
      <div className="scanner-area" onClick={startScan}>{scanning ? (<><i className="fas fa-spinner fa-pulse"></i><p>Scanning...</p></>) : (<><i className="fas fa-camera"></i><p>Tap to scan medication barcode</p></>)}</div>
      {scannedMed && (<div className="scan-result"><h3>Medication Found</h3><div className="med-details"><p><strong>Name:</strong> {scannedMed.name}</p><p><strong>Dosage:</strong> {scannedMed.dosage}</p><p><strong>Manufacturer:</strong> {scannedMed.manufacturer}</p><p><strong>Expiry:</strong> {scannedMed.expiry}</p></div><button className="add-med-btn" onClick={addToPrescriptions}>Add to My Prescriptions</button></div>)}
    </div>
  );
};

export default MedicationScanner;