import React from 'react';
import { GlassCard } from '../UI';
import { CreditCard } from 'lucide-react';

export const LipamdogoManager = () => {
    return (
        <GlassCard className="text-center py-20 animate-slide-up">
            <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-bold text-gray-300">Lipa Mdogo Mdogo</h3>
            <p className="text-gray-500 mt-2">Installment payment management system is currently under development.</p>
        </GlassCard>
    );
};
