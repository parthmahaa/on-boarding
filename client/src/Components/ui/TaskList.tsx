import React from 'react';
import type { Task } from '../../utilities/types';
import { Trash2 } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onAddTask: () => void;
  onUpdateTask: (id: number, text: string) => void;
  onRemoveTask: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onAddTask, onUpdateTask, onRemoveTask }) => {
  return (
    <div>
      {tasks.map((task) => (
        <div key={task.id} className="flex items-center gap-2 mb-2">
          <input
            type="text"
            value={task.text}
            onChange={(e) => onUpdateTask(task.id, e.target.value)}
            placeholder="Task"
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button 
            onClick={() => onRemoveTask(task.id)}
            className="text-red-500 p-2 hover:bg-red-50 rounded-md transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
      
      <button 
        className="mt-2 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors"
        onClick={onAddTask}
      >
        + Add Task
      </button>
    </div>
  );
};

export default TaskList;