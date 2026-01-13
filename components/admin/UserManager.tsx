import React, { useState, useEffect } from 'react';
import { db } from '../../services/insforge';
import { User, UserRole } from '../../types';
import { Button, Input, Label, GlassCard, Badge } from '../UI';
import { Trash, Edit, UserPlus, Phone, Mail, User as UserIcon, Loader2 } from 'lucide-react';

interface UserManagerProps {
    type: 'admin' | 'customer';
}

export const UserManager: React.FC<UserManagerProps> = ({ type }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<Partial<User>>({});
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => { load(); }, [type]);

    const load = () => {
        setLoading(true);
        db.getUsers().then(allUsers => {
            // Filter based on type
            const filtered = allUsers.filter(u => {
                if (type === 'admin') return u.role === 'ADMIN';
                return u.role === 'USER';
            });
            setUsers(filtered);
            setLoading(false);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newUser: User = {
                id: form.id || crypto.randomUUID(),
                email: form.email || '',
                name: form.name || 'New User',
                phone: form.phone || '', // Check types.ts definition, it is 'phone' not 'phoneNumber'
                role: (form.role as UserRole) || (type === 'admin' ? UserRole.ADMIN : UserRole.USER),
                subscription: form.subscription,
                downloads: form.downloads || [],
                // @ts-ignore - types.ts might vary slightly from local defined types in Admin.tsx context, keeping safe
                avatarUrl: form.avatarUrl || `https://ui-avatars.com/api/?name=${form.name || 'User'}`,
            };

            // In a real scenario we need to handle creating auth users vs db documents.
            // Since we are limited to DB operations here:
            // @ts-ignore - db.saveUser usage
            await db.saveUser(newUser);

            setForm({});
            setIsEditing(false);
            load();
            alert(`${type === 'admin' ? 'User' : 'Customer'} Saved!`);
        } catch (e) {
            console.error(e);
            alert('Failed to save.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this user?')) {
            // @ts-ignore
            await db.deleteUser(id);
            load();
        }
    };

    const handleEdit = (u: User) => {
        setForm(u);
        setIsEditing(true);
    };

    return (
        <div className="space-y-8 animate-slide-up">
            <GlassCard>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <UserIcon className="w-5 h-5" /> {isEditing ? 'Edit' : 'Add'} {type === 'admin' ? 'User' : 'Customer'}
                    </h3>
                    {isEditing && (
                        <Button variant="ghost" size="sm" onClick={() => { setForm({}); setIsEditing(false); }}>
                            Cancel
                        </Button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label>Full Name</Label>
                        <Input
                            value={form.name || ''}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            required
                            placeholder="Full Name"
                        />
                    </div>
                    <div>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={form.email || ''}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            required
                            placeholder="Email Address"
                            readOnly={isEditing}
                        />
                    </div>
                    <div>
                        <Label>Phone</Label>
                        <Input
                            value={form.phone || ''}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                            placeholder="07..."
                        />
                    </div>
                    <div>
                        <Label>Role</Label>
                        <select
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white"
                            value={form.role || (type === 'admin' ? 'ADMIN' : 'USER')}
                            onChange={e => setForm({ ...form, role: e.target.value as any })}
                            disabled={true} // Lock role creation to the current tab type for simplicity
                        >
                            <option value="USER">Customer</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    <Button type="submit" className="md:col-span-2" disabled={loading}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isEditing ? 'Update' : 'Create')}
                    </Button>
                </form>
            </GlassCard>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="text-xs uppercase bg-white/5 text-gray-300">
                        <tr>
                            <th className="p-3">Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Phone</th>
                            <th className="p-3">Role</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="p-3 font-medium text-white">{u.name}</td>
                                <td className="p-3">{u.email}</td>
                                <td className="p-3">{u.phone || '-'}</td>
                                <td className="p-3"><Badge color={u.role === 'ADMIN' ? 'purple' : 'blue'}>{u.role}</Badge></td>
                                <td className="p-3 flex gap-2">
                                    <Button size="sm" variant="ghost" onClick={() => handleEdit(u)}><Edit className="w-4 h-4 text-blue-400" /></Button>
                                    <Button size="sm" variant="ghost" onClick={() => handleDelete(u.id)}><Trash className="w-4 h-4 text-red-400" /></Button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr><td colSpan={5} className="p-8 text-center">No {type}s found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
