// App.jsx
import React, { useState } from 'react';

export default function ConstructionDashboard() {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setAnalysis(null);
        }
    };

    const handleAnalyze = async () => {
        if (!image) return;
        setLoading(true);

        const formData = new FormData();
        formData.append('file', image);

        try {
            const response = await fetch('http://localhost:8000/api/analyze-site', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            setAnalysis(data); // Guaranteed to match SiteAnalysisResponse schema
        } catch (error) {
            console.error("Analysis failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Site Intelligence Monitor</h1>

            <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px dashed #ccc', borderRadius: '8px' }}>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                <button
                    onClick={handleAnalyze}
                    disabled={!image || loading}
                    style={{ marginLeft: '1rem', padding: '0.5rem 1rem', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    {loading ? 'Analyzing Multimodal Data...' : 'Run Safety Analysis'}
                </button>
            </div>

            {preview && (
                <div style={{ marginBottom: '2rem' }}>
                    <img src={preview} alt="Site Feed" style={{ maxWidth: '100%', borderRadius: '8px' }} />
                </div>
            )}

            {analysis && (
                <div style={{ background: '#f5f5f5', padding: '1.5rem', borderRadius: '8px' }}>
                    <h2>Intelligence Report</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ background: 'white', padding: '1rem', borderRadius: '4px', borderLeft: analysis.compliance_summary.violations_found ? '4px solid red' : '4px solid green' }}>
                            <strong>PPE Compliance</strong>
                            <p>Hard Hats: {analysis.compliance_summary.hard_hats_detected}</p>
                            <p>Vests: {analysis.compliance_summary.hi_vis_vests_detected}</p>
                            <p style={{ color: analysis.compliance_summary.violations_found ? 'red' : 'green', fontWeight: 'bold' }}>
                                {analysis.compliance_summary.violations_found ? '⚠ VIOLATION DETECTED' : '✓ COMPLIANT'}
                            </p>
                        </div>

                        <div style={{ background: 'white', padding: '1rem', borderRadius: '4px', borderLeft: analysis.structural_defects.length > 0 ? '4px solid orange' : '4px solid green' }}>
                            <strong>Structural Integrity</strong>
                            {analysis.structural_defects.length === 0 ? <p>No defects detected.</p> : (
                                analysis.structural_defects.map((defect, idx) => (
                                    <div key={idx} style={{ marginBottom: '0.5rem' }}>
                                        <span style={{ textTransform: 'capitalize' }}>{defect.defect_type.replace('_', ' ')}</span>
                                        <span style={{ marginLeft: '0.5rem', padding: '0.1rem 0.4rem', background: '#ffe4e4', color: '#cc0000', borderRadius: '4px', fontSize: '0.8rem' }}>
                                            {defect.severity}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div style={{ background: '#e6f7ff', padding: '1rem', borderLeft: '4px solid #1890ff', borderRadius: '4px' }}>
                        <strong>Recommended Action:</strong>
                        <p style={{ margin: '0.5rem 0 0 0' }}>{analysis.recommended_action}</p>
                    </div>
                </div>
            )}
        </div>
    );
}