import { CATEGORIES } from '../data/questions';

const COLOR_MAP = {
  blue: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  orange: 'bg-orange-100 text-orange-700',
  green: 'bg-green-100 text-green-700',
  red: 'bg-red-100 text-red-700',
  indigo: 'bg-indigo-100 text-indigo-700',
  teal: 'bg-teal-100 text-teal-700',
  pink: 'bg-pink-100 text-pink-700',
};

export default function CategoryBadge({ categoryId }) {
  const cat = CATEGORIES.find(c => c.id === categoryId);
  if (!cat) return null;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${COLOR_MAP[cat.color] || 'bg-slate-100 text-slate-700'}`}>
      {cat.icon} {cat.label}
    </span>
  );
}
