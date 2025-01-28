import { View, Text, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRef, useState } from 'react';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { ReceiptContent } from './ReceiptContent';

type Props = {
  visible: boolean;
  onClose: () => void;
  orderId: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  date: string;
};

export function Receipt(props: Props) {
  const receiptRef = useRef<ViewShot>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!receiptRef.current) return;
    
    try {
      setDownloading(true);
      
      // Capture the receipt view
      const uri = await receiptRef.current.capture();
      
      // Share the receipt
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: `Receipt for Order #${props.orderId}`,
      });
      
      props.onClose();
    } catch (error) {
      console.error('Failed to download receipt:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Modal
      visible={props.visible}
      transparent
      animationType="slide"
      onRequestClose={props.onClose}
    >
      <BlurView intensity={20} className="flex-1">
        <View className="flex-1 justify-end">
          <View className="bg-white rounded-t-3xl">
            <View className="p-6">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-2xl font-semibold">Receipt</Text>
                <TouchableOpacity 
                  onPress={props.onClose}
                  className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
                >
                  <Ionicons name="close" size={24} color="#374151" />
                </TouchableOpacity>
              </View>
            </View>

            <ViewShot ref={receiptRef} options={{ format: 'png', quality: 0.9 }}>
              <ReceiptContent {...props} />
            </ViewShot>

            <View className="p-6">
              <TouchableOpacity 
                className="bg-primary py-4 rounded-xl"
                onPress={handleDownload}
                disabled={downloading}
              >
                {downloading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-semibold">
                    Download Receipt
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
} 

