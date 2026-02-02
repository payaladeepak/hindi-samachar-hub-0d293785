import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

export interface UserWithRole {
  id: string;
  email: string;
  created_at: string;
  role: AppRole | null;
  role_id: string | null;
  last_sign_in?: string | null;
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      // Get all user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (rolesError) throw rolesError;

      // Create a map of user_id to role info
      const rolesMap = new Map<string, { role: AppRole; role_id: string; created_at: string }>();
      roles?.forEach((role) => {
        // Only keep one role per user (use the first one found)
        if (!rolesMap.has(role.user_id)) {
          rolesMap.set(role.user_id, {
            role: role.role,
            role_id: role.id,
            created_at: role.created_at,
          });
        }
      });

      // Get profiles for all users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Build user list from profiles (which contains all registered users)
      const users: UserWithRole[] = [];

      profiles?.forEach((profile) => {
        const roleInfo = rolesMap.get(profile.user_id);
        users.push({
          id: profile.user_id,
          email: profile.display_name || profile.user_id.slice(0, 8) + '...',
          created_at: profile.created_at,
          role: roleInfo?.role || null,
          role_id: roleInfo?.role_id || null,
        });
      });

      // Also include users that have roles but may not have profiles yet
      roles?.forEach((role) => {
        const existsInProfiles = profiles?.some(p => p.user_id === role.user_id);
        if (!existsInProfiles) {
          const existingUser = users.find(u => u.id === role.user_id);
          if (!existingUser) {
            users.push({
              id: role.user_id,
              email: role.user_id.slice(0, 8) + '...',
              created_at: role.created_at,
              role: role.role,
              role_id: role.id,
            });
          }
        }
      });

      return users;
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role, existingRoleId }: { userId: string; role: AppRole; existingRoleId: string | null }) => {
      if (existingRoleId) {
        // Update existing role
        const { error } = await supabase
          .from('user_roles')
          .update({ role })
          .eq('id', existingRoleId);

        if (error) throw error;
      } else {
        // Insert new role
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useDeleteUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roleId: string) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useAssignRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
