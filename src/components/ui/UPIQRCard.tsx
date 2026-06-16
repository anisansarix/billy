
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { ShieldCheck } from 'lucide-react-native';
import { formatINR } from '@/utils/money';
import { Business } from '@/types/entities';

interface UPIQRCardProps {
  business: Business;
  amountPaise: number;
  documentNumber: string;
}

export default function UPIQRCard({ business, amountPaise, documentNumber }: UPIQRCardProps) {
  if (!business.upiVpa) return null;

  const upiString = `upi://pay?pa=${encodeURIComponent(business.upiVpa)}&pn=${encodeURIComponent(business.tradeName ?? business.legalName)}&am=${(amountPaise / 100).toFixed(2)}&cu=INR&tn=Invoice%20${encodeURIComponent(documentNumber)}`;

  return (
    <View className="bg-white border border-border rounded-2xl p-5 items-center mx-5 mb-4">
      <View className="flex-row items-center mb-4">
        <ShieldCheck color="#208AEF" size={20} className="mr-2" />
        <Text className="font-sans-bold text-primary text-base">Scan & Pay</Text>
      </View>
      
      <View className="mb-4">
        <QRCode
          value={upiString}
          size={140}
          backgroundColor="transparent"
          color="#081126"
        />
      </View>
      
      <Text className="font-sans-bold text-2xl text-primary mb-1">{formatINR(amountPaise)}</Text>
      <Text className="font-sans-medium text-sm text-muted-foreground mb-3">Pay via any UPI app</Text>
      <Text className="font-mono text-xs text-muted-foreground bg-slate-50 px-3 py-1.5 rounded-md">{business.upiVpa}</Text>
    </View>
  );
}
