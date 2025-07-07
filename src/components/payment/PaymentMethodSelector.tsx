import React from 'react';
import { CreditCard, Smartphone, Truck } from 'lucide-react';
import { PaymentMethod } from '../../types';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange
}) => {
  const paymentMethods = [
    {
      id: PaymentMethod.COD,
      name: 'Bayar di Tempat (COD)',
      description: 'Bayar saat barang diterima',
      icon: <Truck className="h-6 w-6" />,
      fee: 0
    },
    {
      id: PaymentMethod.BANK_MANDIRI,
      name: 'Transfer Bank Mandiri',
      description: 'Transfer ke rekening Bank Mandiri',
      icon: <CreditCard className="h-6 w-6" />,
      fee: 0
    },
  ];

  return (
    <div className="space-y-3">
      {paymentMethods.map((method) => (
        <div
          key={method.id}
          className={`border rounded-lg p-4 cursor-pointer transition-all ${
            selectedMethod === method.id
              ? 'border-primary-500 bg-primary-50'
              : 'border-neutral-200 hover:border-neutral-300'
          }`}
          onClick={() => onMethodChange(method.id)}
        >
          <div className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={() => onMethodChange(method.id)}
              className="h-4 w-4 text-primary-500 border-neutral-300 focus:ring-primary-500"
            />
            <div className="ml-3 flex items-center flex-grow">
              <div className="text-primary-500 mr-3">
                {method.icon}
              </div>
              <div className="flex-grow">
                <h3 className="font-medium text-neutral-900">{method.name}</h3>
                <p className="text-sm text-neutral-600">{method.description}</p>
              </div>
              {method.fee > 0 && (
                <div className="text-sm text-neutral-500">
                  +Rp{method.fee.toLocaleString('id-ID')}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentMethodSelector;