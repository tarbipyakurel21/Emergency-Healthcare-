import React, { useState } from 'react';
import './MedicalProfileForm.css';

const MedicalProfileForm = ({ onSave, initialData = {} }) => {
    const [formData, setFormData] = useState({
        blood_type: initialData.blood_type || '',
        allergies: initialData.allergies || [],
        medical_conditions: initialData.medical_conditions || [],
        current_medications: initialData.current_medications || [],
        emergency_contact_name: initialData.emergency_contact_name || '',
        emergency_contact_phone: initialData.emergency_contact_phone || '',
        emergency_contact_relationship: initialData.emergency_contact_relationship || '',
        date_of_birth: initialData.date_of_birth || '',
        height: initialData.height || '',
        weight: initialData.weight || '',
        primary_physician: initialData.primary_physician || '',
        physician_phone: initialData.physician_phone || '',
        insurance_provider: initialData.insurance_provider || '',
        insurance_id: initialData.insurance_id || ''
    });

    const [newAllergy, setNewAllergy] = useState('');
    const [newCondition, setNewCondition] = useState('');
    const [newMedication, setNewMedication] = useState('');

    const handleAddAllergy = () => {
        if (newAllergy.trim()) {
            setFormData({
                ...formData,
                allergies: [...formData.allergies, newAllergy.trim()]
            });
            setNewAllergy('');
        }
    };

    const handleRemoveAllergy = (index) => {
        const updated = formData.allergies.filter((_, i) => i !== index);
        setFormData({ ...formData, allergies: updated });
    };

    // Similar functions for conditions and medications...

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="medical-profile-form">
            <h3>Medical Information</h3>
            <form onSubmit={handleSubmit}>
                
                <div className="form-group">
                    <label>Blood Type *</label>
                    <select 
                        value={formData.blood_type} 
                        onChange={(e) => setFormData({...formData, blood_type: e.target.value})}
                        required
                    >
                        <option value="">Select Blood Type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Allergies</label>
                    <div className="array-input">
                        <input
                            type="text"
                            value={newAllergy}
                            onChange={(e) => setNewAllergy(e.target.value)}
                            placeholder="Add allergy"
                        />
                        <button type="button" onClick={handleAddAllergy}>Add</button>
                    </div>
                    <div className="array-list">
                        {formData.allergies.map((allergy, index) => (
                            <span key={index} className="array-item">
                                {allergy}
                                <button type="button" onClick={() => handleRemoveAllergy(index)}>×</button>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Medical Conditions</label>
                    {/* Similar to allergies */}
                </div>

                <div className="form-group">
                    <label>Current Medications</label>
                    {/* Similar to allergies */}
                </div>

                <div className="form-section">
                    <h4>Emergency Contact</h4>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                value={formData.emergency_contact_name}
                                onChange={(e) => setFormData({...formData, emergency_contact_name: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input
                                type="tel"
                                value={formData.emergency_contact_phone}
                                onChange={(e) => setFormData({...formData, emergency_contact_phone: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Relationship</label>
                        <input
                            type="text"
                            value={formData.emergency_contact_relationship}
                            onChange={(e) => setFormData({...formData, emergency_contact_relationship: e.target.value})}
                        />
                    </div>
                </div>

                <button type="submit" className="save-btn">Save Medical Profile</button>
            </form>
        </div>
    );
};

export default MedicalProfileForm;