"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import { Loader2, Trash2, Shield, User as UserIcon } from "lucide-react";
import Swal from "sweetalert2";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await adminService.getAllUsers();
      setUsers(res);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      fetchUsers();
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Role updated',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Update failed',
        text: error.response?.data?.message || 'Something went wrong',
      });
    }
  };

  const handleDelete = async (userId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete user!'
    });

    if (result.isConfirmed) {
      try {
        await adminService.deleteUser(userId);
        fetchUsers();
        Swal.fire('Deleted!', 'User has been deleted.', 'success');
      } catch (error: any) {
        Swal.fire('Error!', error.response?.data?.message || 'Failed to delete user.', 'error');
      }
    }
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Manage Users</h1>
        <p className="text-muted mt-1">View, update roles, or remove users from the platform.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background border-b border-border">
                <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">User</th>
                <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">Email</th>
                <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">Credits</th>
                <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider">Role</th>
                <th className="p-4 font-semibold text-sm text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u: any) => (
                <tr key={u._id} className="hover:bg-background/50">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-foreground">{u.name}</span>
                  </td>
                  <td className="p-4 text-muted">{u.email}</td>
                  <td className="p-4 font-semibold text-amber-500">{u.credits} C</td>
                  <td className="p-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      disabled={u.role === 'admin'}
                      className="px-2 py-1 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-primary disabled:opacity-50"
                    >
                      <option value="supporter">Supporter</option>
                      <option value="creator">Creator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(u._id)}
                      disabled={u.role === 'admin'}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
