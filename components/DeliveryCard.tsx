import React, { useState, useEffect, useRef } from 'react';
import { DeliveryCardData } from '../types';
import { ChevronRightIcon } from './Icons';

interface DeliveryCardProps {
  data: DeliveryCardData;
  isOpen: boolean;
  onToggle: () => void;
}

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5 my-4">
    <div
      className="bg-[#3095A6] h-2.5 rounded-full transition-all duration-500 ease-out"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

const DeliveryCard: React.FC<DeliveryCardProps> = ({ data, isOpen, onToggle }) => {
  const [checkedTasks, setCheckedTasks] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState(0);
  const prevProgressRef = useRef(0);

  const handleCheckboxChange = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card from toggling when clicking checkbox
    const newCheckedTasks = new Set(checkedTasks);
    if (newCheckedTasks.has(taskId)) {
      newCheckedTasks.delete(taskId);
    } else {
      newCheckedTasks.add(taskId);
    }
    setCheckedTasks(newCheckedTasks);
  };

  useEffect(() => {
    const totalTasks = data.tasks.length;
    const completedTasks = checkedTasks.size;
    const newProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    setProgress(newProgress);

    if (newProgress === 100 && prevProgressRef.current < 100) {
      if (typeof (window as any).confetti === 'function') {
        const rect = document.getElementById(data.id)?.getBoundingClientRect();
        const x = rect ? (rect.left + rect.right) / 2 / window.innerWidth : 0.5;
        const y = rect ? (rect.top + rect.bottom) / 2 / window.innerHeight : 0.5;

        (window as any).confetti({
          particleCount: 150,
          spread: 90,
          origin: { y, x },
          zIndex: 10000,
        });
      }
    }
    prevProgressRef.current = newProgress;
  }, [checkedTasks, data.tasks, data.id]);

  return (
    <div
      id={data.id}
      className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      onClick={onToggle}
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onToggle()}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-4">
          <h3 className="text-xl font-bold text-gray-800">{data.title}</h3>
          <p className="text-gray-600 mt-1 text-sm">{data.description}</p>
        </div>
        <ChevronRightIcon
          className={`h-6 w-6 text-gray-500 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-90' : ''}`}
        />
      </div>

      <div className="flex items-center gap-4 mt-3">
        <div className="flex-1">
            <ProgressBar progress={progress} />
        </div>
        <span className="font-semibold text-[#0A3130] text-lg">{progress}%</span>
      </div>
      
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}
      >
        <div className="border-t border-gray-200 pt-4 space-y-3">
          <h4 className="font-semibold text-gray-700">Tarefas:</h4>
          {data.tasks.map((task) => (
            <label
              key={task.id}
              className="flex items-center space-x-3 cursor-pointer group p-1 -m-1 rounded-md hover:bg-gray-100"
              onClick={(e) => handleCheckboxChange(task.id, e)}
            >
              <input
                type="checkbox"
                checked={checkedTasks.has(task.id)}
                readOnly
                className="h-5 w-5 rounded border-gray-300 text-[#3095A6] focus:ring-[#3095A6] cursor-pointer"
              />
              <span className={`text-gray-700 group-hover:text-[#0A3130] transition-colors ${checkedTasks.has(task.id) ? 'line-through text-gray-400' : ''}`}>
                {task.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliveryCard;