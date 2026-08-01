/* A React component that displays a badge indicating the difficulty level*/
export const DifficultyBadge = ({ difficulty }) => {
  const colorMap = {
    Easy: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    Medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    Hard: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const badgeStyles = colorMap[difficulty] || colorMap.Medium;

  return <span className={`px-2.5 py-1 text-xs font-medium border rounded-full ${badgeStyles}`}>{difficulty}</span>;
};
