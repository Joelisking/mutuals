'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Loader2, Plus, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AdminUser } from '@/lib/types/api';
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserRoleMutation,
} from '@/lib/redux/api/users.api';

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  ADMIN: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  EDITOR: 'bg-green-500/20 text-green-300 border-green-500/30',
  CONTRIBUTOR: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
};

function RoleBadge({ role }: { role: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${ROLE_COLORS[role] ?? 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30'}`}>
      {role}
    </span>
  );
}

function RoleSelect({ userId, currentRole }: { userId: string; currentRole: string }) {
  const [updateUserRole, { isLoading }] = useUpdateUserRoleMutation();

  const handleChange = async (role: string) => {
    try {
      await updateUserRole({ id: userId, role: role as 'ADMIN' | 'EDITOR' | 'CONTRIBUTOR' }).unwrap();
      toast.success('Role updated');
    } catch {
      toast.error('Failed to update role');
    }
  };

  if (currentRole === 'SUPER_ADMIN') return <RoleBadge role={currentRole} />;

  return (
    <Select defaultValue={currentRole} onValueChange={handleChange} disabled={isLoading}>
      <SelectTrigger className="h-7 w-36 text-xs bg-zinc-900 border-zinc-700">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ADMIN">ADMIN</SelectItem>
        <SelectItem value="EDITOR">EDITOR</SelectItem>
        <SelectItem value="CONTRIBUTOR">CONTRIBUTOR</SelectItem>
      </SelectContent>
    </Select>
  );
}

const columns: ColumnDef<AdminUser>[] = [
  {
    accessorKey: 'firstName',
    header: 'Name',
    cell: ({ row }) => (
      <span>{row.original.firstName} {row.original.lastName}</span>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => (
      <RoleSelect userId={row.original.id} currentRole={row.original.role} />
    ),
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? 'default' : 'secondary'} className="text-xs">
        {row.original.isActive ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Joined',
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
];

interface TempPasswordModalProps {
  email: string;
  tempPassword: string;
  onClose: () => void;
}

function TempPasswordModal({ email, tempPassword, onClose }: TempPasswordModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-zinc-950 border-zinc-800">
        <DialogHeader>
          <DialogTitle>User Created Successfully</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <p className="text-sm text-zinc-400">
            An account has been created for <span className="text-white font-medium">{email}</span>.
            Share the temporary password below — the user should change it on first login.
          </p>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-zinc-900 border border-zinc-800">
            <code className="flex-1 text-sm font-mono text-green-400">{tempPassword}</code>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-zinc-500">
            This password will not be shown again.
          </p>
          <Button className="w-full text-black" onClick={onClose}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function UsersPage() {
  const { data, isLoading } = useGetUsersQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [tempPasswordData, setTempPasswordData] = useState<{ email: string; tempPassword: string } | null>(null);

  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'EDITOR' as 'ADMIN' | 'EDITOR' | 'CONTRIBUTOR',
  });

  const users = (data as any)?.data ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createUser(form).unwrap();
      const { user, tempPassword } = (result as any).data;
      setIsAddOpen(false);
      setForm({ email: '', firstName: '', lastName: '', role: 'EDITOR' });
      setTempPasswordData({ email: user.email, tempPassword });
    } catch (err: any) {
      toast.error(err?.data?.message ?? 'Failed to create user');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Users</h1>
          <p className="text-sm text-muted-foreground">Manage admin team members and their roles</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="text-black">
              <Plus className="mr-2 h-4 w-4" />
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-950 border-zinc-800">
            <DialogHeader>
              <DialogTitle>Add New Admin</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    required
                    className="bg-zinc-900 border-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    required
                    className="bg-zinc-900 border-zinc-800"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(val) => setForm({ ...form, role: val as typeof form.role })}
                >
                  <SelectTrigger className="bg-zinc-900 border-zinc-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">ADMIN</SelectItem>
                    <SelectItem value="EDITOR">EDITOR</SelectItem>
                    <SelectItem value="CONTRIBUTOR">CONTRIBUTOR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={isCreating} className="w-full text-black">
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create User
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DataTable columns={columns} data={users} />

      {tempPasswordData && (
        <TempPasswordModal
          email={tempPasswordData.email}
          tempPassword={tempPasswordData.tempPassword}
          onClose={() => setTempPasswordData(null)}
        />
      )}
    </div>
  );
}
