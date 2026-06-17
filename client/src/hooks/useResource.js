import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { dataService } from '../lib/dataService.js';

const labels = {
  patients: 'Patient',
  doctors: 'Doctor',
  departments: 'Department',
  appointments: 'Appointment',
  invoices: 'Invoice',
};

export function useList(resource, params = {}) {
  return useQuery({
    queryKey: [resource, params],
    queryFn: () => dataService[resource].list(params),
    select: (res) => res.data,
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dataService.dashboard.stats(),
    select: (res) => res.data,
    refetchInterval: 30000,
  });
}

export function useCreate(resource) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body) => dataService[resource].create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [resource] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(`${labels[resource] || 'Record'} created`);
    },
    onError: (err) => toast.error(err.message),
  });
}

export function useUpdate(resource) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }) => dataService[resource].update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [resource] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(`${labels[resource] || 'Record'} updated`);
    },
    onError: (err) => toast.error(err.message),
  });
}

export function useRemove(resource) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => dataService[resource].remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [resource] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(`${labels[resource] || 'Record'} deleted`);
    },
    onError: (err) => toast.error(err.message),
  });
}
