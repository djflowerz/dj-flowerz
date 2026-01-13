import React from 'react';
import { GlassCard } from '../UI';
import { FileText } from 'lucide-react';

export const InvoiceManager = () => {
    return (
        <GlassCard className="text-center py-20 animate-slide-up">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-bold text-gray-300">Invoices</h3>
            <p className="text-gray-500 mt-2">Invoice generation and management will appear here.</p>
        </GlassCard>
    );
};
