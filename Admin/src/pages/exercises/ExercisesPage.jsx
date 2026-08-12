import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Search, Plus, Filter, Heart, Play, Download, MoreVertical, Sparkles, CheckCircle,
} from 'lucide-react';
import { api } from '../../api/api.js';

const MOCK_EXERCISES = [
  { _id: 'ex_1', name: 'Weighted Goblet Squat', bodyPart: 'Lower Body', difficulty: 'Beginner', duration: '10 mins', likes: 142, thumb: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300' },
  { _id: 'ex_2', name: 'Pelvic Tilt & Core Engagement', bodyPart: 'Lower Back', difficulty: 'Beginner', duration: '5 mins', likes: 210, thumb: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300' },
  { _id: 'ex_3', name: 'Straight Leg Raise', bodyPart: 'Knee Rehab', difficulty: 'Intermediate', duration: '8 mins', likes: 98, thumb: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300' },
];

export default function ExercisesPage() {
  const token    = useSelector(s => s.auth.accessToken);
  const navigate = useNavigate();
  const [exercises, setExercises] = useState(MOCK_EXERCISES);
  const [loading, setLoading]     = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.listExercises(token);
      if (res.data && res.data.length > 0) setExercises(res.data);
    } catch {}
    setLoading(false);
  }, [token]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Exercise Library</h1>
          <p className="text-xs text-slate-500 mt-0.5">Comprehensive database of therapeutic exercises with 4K video demonstrations.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button className="btn btn-secondary text-xs" onClick={() => alert('Importing…')}>
            <Download size={14} /> Import
          </button>
          <button className="btn btn-primary text-xs" onClick={() => navigate('/exercises/create')}>
            <Plus size={15} /> Create Exercise
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {exercises.map(ex => (
          <div key={ex._id} className="card overflow-hidden cursor-pointer card-hover">
            <div className="relative h-40 bg-slate-900">
              <img src={ex.thumb || 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300'} alt={ex.name} className="w-full h-full object-cover opacity-85" />
              <button className="absolute inset-0 flex items-center justify-center text-white text-3xl">▶</button>
            </div>
            <div className="p-4 space-y-2">
              <span className="badge badge-blue text-[10px]">{ex.bodyPart}</span>
              <h3 className="font-bold text-sm text-slate-900">{ex.name}</h3>
              <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-100">
                <span>⏱ {ex.duration}</span>
                <span className="flex items-center gap-1 text-red-500 font-bold"><Heart size={12} fill="currentColor" /> {ex.likes || 120}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
