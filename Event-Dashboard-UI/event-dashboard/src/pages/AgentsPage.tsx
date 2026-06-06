import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardHeader from '../components/Layout/DashboardHeader';
import DashboardSidebar from '../components/Layout/DashboardSidebar';
import AgentForm from '../components/Agents/AgentForm';
import AgentsTable from '../components/Agents/AgentsTable';
import AgentsFilter from '../components/Agents/AgentFilter';
import { agentService } from '../services/agentService';

const AgentsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAgent, setEditingAgent] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    sortBy: { field: 'createdAt', order: 'desc' },
  });

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await agentService.getAll(filters);
      setAgents(data);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchAgents(); }, [fetchAgents]);

  const handleFormSuccess = () => {
    fetchAgents();
    setEditingAgent(null);
    alert(editingAgent ? t('agents.updateSuccess') : t('agents.addSuccess'));
  };

  const handleEdit = (agent) => {
    setEditingAgent(agent);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      await agentService.delete(id);
      fetchAgents();
      alert(t('agents.deleteSuccess'));
    } catch (error) {
      console.error('Error deleting agent:', error);
      alert('Error deleting agent');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader onLogout={handleLogout} />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('agents.title')}</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{t('agents.subtitle')}</p>
            </div>

            <AgentForm editingAgent={editingAgent} onSuccess={handleFormSuccess} onCancel={() => setEditingAgent(null)} />
            <AgentsFilter filters={filters} onFilterChange={setFilters} />
            <AgentsTable agents={agents} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AgentsPage;