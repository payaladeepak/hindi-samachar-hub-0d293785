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
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      // Get all users from auth (via profiles or user_roles)
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (rolesError) throw rolesError;

      // Get profiles for additional info
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Combine data - user_roles contains user_id, profiles contains user info
      const usersMap = new Map<string, UserWithRole>();

      // Add users from roles
      roles?.forEach((role) => {
        usersMap.set(role.user_id, {
          id: role.user_id,
          email: '', // Will be filled from profiles if available
          created_at: role.created_at,
          role: role.role,
          role_id: role.id,
        });
      });

      // Add profile info
      profiles?.forEach((profile) => {
        const existing = usersMap.get(profile.user_id);
        if (existing) {
          existing.email = profile.display_name || profile.user_id;
        } else {
          usersMap.set(profile.user_id, {
            id: profile.user_id,
            email: profile.display_name || profile.user_id,
            created_at: profile.created_at,
            role: null,
            role_id: null,
          });
        }
      });

      return Array.from(usersMap.values());
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
