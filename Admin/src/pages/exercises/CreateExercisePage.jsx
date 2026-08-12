import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Upload, Save, AlertTriangle, AlertCircle, Plus, X, Video, Image as ImageIcon,
  PlayCircle, Maximize2, Copy, Trash2, CheckCircle, Bold, Italic, List, Link,
} from 'lucide-react';

export default function CreateExercisePage() {
  const navigate = useNavigate();

  const [name, setName]               = useState('Weighted Goblet Squat');
  const [category, setCategory]       = useState('Strength & Conditioning');
  const [duration, setDuration]       = useState('10');
  const [difficulty, setDifficulty] = useState('Beginner');
  const [bodyAreas, setBodyAreas]     = useState(['Lower Back', 'Hips', 'Core']);
  const [instructions, setInstructions] = useState('Keep chest upright, hold weight close to chest...');
  const [precautions, setPrecautions] = useState('Avoid if you have acute knee inflammation.');
  const [mistakes, setMistakes]       = useState('Rounding the back, looking down.');

  const [equipment, setEquipment]     = useState(['Yoga Mat', 'Resistance Band']);
  const [muscles, setMuscles]         = useState(['Glutes', 'Hamstrings']);
  const [contraindications, setContraindications] = useState(['Acute Disc Prolapse']);

  const handleSave = (e) => {
    e.preventDefault();
    alert(`Exercise "${name}" saved successfully!`);
    navigate('/exercises');
  };

  return (
    <div className="animate-fade-up max-w-[1300px] space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <button onClick={() => navigate('/exercises')} className="btn btn-secondary btn-sm">
            <ArrowLeft size={14} /> Exercise Library
          </button>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-700">Create Exercise</span>
        </div>

        <div className="flex gap-2">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/exercises')}>
            Save as Draft
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            <Save size={15} /> Save Exercise
          </button>
        </div>
      </div>

      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Create Exercise</h2>
        <div className="space-y-3">
          <div>
            <label className="label">Exercise Name</label>
            <input className="input text-xs" value={name} onChange={e => setName(e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
}
