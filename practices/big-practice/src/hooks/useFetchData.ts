import { useState, useEffect } from 'react';
import { apiRequest } from '@/services';
import { API_ROUTES } from '@/constant';
import { API_BASE_URL } from '@/config';
import { UserData, TaskData, ProjectsData } from '@/types';

export const useFetchData = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [projects, setProjects] = useState<ProjectsData[]>([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const [
          usersData,
          tasksData,
          projectsData
        ] = await Promise.all([
          apiRequest<UserData[], UserData[]>('GET', `${API_BASE_URL}${API_ROUTES.USERS}`),
          apiRequest<TaskData[], TaskData[]>('GET', `${API_BASE_URL}${API_ROUTES.TASKS}`),
          apiRequest<ProjectsData[], ProjectsData[]>('GET', `${API_BASE_URL}${API_ROUTES.PROJECTS}`)
        ]);
        setUsers(usersData);
        setTasks(tasksData);
        setProjects(projectsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { users, tasks, projects, isLoading, setUsers, setTasks, setProjects };
};
