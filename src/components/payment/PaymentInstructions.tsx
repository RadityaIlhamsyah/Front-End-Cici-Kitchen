import React from 'react';
import { Copy, CheckCircle } from 'lucide-react';
import { PaymentMethod } from '../../types';
import { toast } from 'react-toastify';

interface PaymentInstructionsProps {
  paymentMethod: PaymentMethod;
  totalAmount: number;
  orderId: string;
}

const PaymentInstructions: React.FC<PaymentInstructionsProps> = ({
  paymentMethod,
  totalAmount,
  orderId
}) => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} berhasil disalin!`);
  };

  const bankMandiriInfo = {
    accountNumber: '1666668735',
    accountName: 'Fayza Vincy Adisty',
    bankCode: '008'
  };

  if (paymentMethod === PaymentMethod.COD) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-900 mb-2">Bayar di Tempat (COD)</h3>
            <p className="text-blue-800 text-sm">
              Pesanan Anda akan diproses dan dikirim. Pembayaran dilakukan saat barang diterima.
            </p>
            <div className="mt-3 p-3 bg-blue-100 rounded-md">
              <p className="text-sm font-medium text-blue-900">
                Total yang harus dibayar: Rp{totalAmount.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (paymentMethod === PaymentMethod.BANK_MANDIRI) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <CheckCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
          <div className="flex-grow">
            <h3 className="font-medium text-yellow-900 mb-3">Transfer Bank Mandiri</h3>
            
            <div className="space-y-3">
              <div className="bg-yellow-100 p-3 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-yellow-900">Nomor Rekening:</span>
                  <button
                    onClick={() => copyToClipboard(bankMandiriInfo.accountNumber, 'Nomor rekening')}
                    className="text-yellow-700 hover:text-yellow-800"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <p className="font-mono text-lg font-bold text-yellow-900">
                  {bankMandiriInfo.accountNumber}
                </p>
              </div>

              <div className="bg-yellow-100 p-3 rounded-md">
                <span className="text-sm font-medium text-yellow-900">Nama Penerima:</span>
                <p className="font-semibold text-yellow-900">{bankMandiriInfo.accountName}</p>
              </div>

              <div className="bg-yellow-100 p-3 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-yellow-900">Jumlah Transfer:</span>
                  <button
                    onClick={() => copyToClipboard(totalAmount.toString(), 'Jumlah transfer')}
                    className="text-yellow-700 hover:text-yellow-800"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
                <p className="font-mono text-lg font-bold text-yellow-900">
                  Rp{totalAmount.toLocaleString('id-ID')}
                </p>
              </div>

              <div className="bg-yellow-100 p-3 rounded-md">
                <span className="text-sm font-medium text-yellow-900">Kode Berita/Referensi:</span>
                <div className="flex justify-between items-center">
                  <p className="font-mono font-bold text-yellow-900">CICI-{orderId.slice(-6)}</p>
                  <button
                    onClick={() => copyToClipboard(`CICI-${orderId.slice(-6)}`, 'Kode referensi')}
                    className="text-yellow-700 hover:text-yellow-800"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-200 rounded-md">
              <h4 className="font-medium text-yellow-900 mb-2">Petunjuk Transfer:</h4>
              <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
                <li>Buka aplikasi Livin' by Mandiri atau ATM Mandiri</li>
                <li>Pilih menu Transfer ke Rekening Mandiri</li>
                <li>Masukkan nomor rekening tujuan</li>
                <li>Masukkan jumlah transfer sesuai total pesanan</li>
                <li>Masukkan kode berita/referensi</li>
                <li>Konfirmasi dan selesaikan transaksi</li>
                <li>Simpan bukti transfer untuk konfirmasi</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentInstructions;
