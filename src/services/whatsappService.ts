import whatsappConfig from '../data/whatsapp-config.json';

export interface WhatsAppOrderData {
  customerName: string;
  customerPhone: string;
  orderItems: Array<{
    productName: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  totalAmount: number;
  orderNumber: string;
}

export class WhatsAppService {
  private static formatOrderDetails(items: WhatsAppOrderData['orderItems']): string {
    return items.map(item => 
      `• ${item.productName} x${item.quantity} - $${item.total.toFixed(2)}`
    ).join('\n');
  }

  private static formatPhoneNumber(phone: string): string {
    // Remover caracteres no numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Si no tiene código de país, asumir que es local y agregar código por defecto
    if (cleanPhone.length === 10) {
      return `+1${cleanPhone}`; // Código de país por defecto
    }
    
    // Si ya tiene código de país
    if (cleanPhone.startsWith('1') && cleanPhone.length === 11) {
      return `+${cleanPhone}`;
    }
    
    return cleanPhone.startsWith('+') ? phone : `+${cleanPhone}`;
  }

  static generateOrderConfirmationMessage(orderData: WhatsAppOrderData): string {
    const template = whatsappConfig.whatsapp.messages.orderConfirmation;
    const orderDetails = this.formatOrderDetails(orderData.orderItems);
    
    return template
      .replace('{orderDetails}', orderDetails)
      .replace('{totalAmount}', orderData.totalAmount.toFixed(2));
  }

  static generateWhatsAppURL(orderData: WhatsAppOrderData): string {
    const businessPhone = whatsappConfig.whatsapp.phoneNumber;
    const message = this.generateOrderConfirmationMessage(orderData);
    const encodedMessage = encodeURIComponent(message);
    
    return `https://wa.me/${businessPhone.replace('+', '')}?text=${encodedMessage}`;
  }

  static sendOrderToCustomer(orderData: WhatsAppOrderData): void {
    try {
      const customerPhone = this.formatPhoneNumber(orderData.customerPhone);
      const message = this.generateOrderConfirmationMessage(orderData);
      const encodedMessage = encodeURIComponent(message);
      
      const whatsappURL = `https://wa.me/${customerPhone.replace('+', '')}?text=${encodedMessage}`;
      
      console.log('📱 Enviando mensaje de WhatsApp al cliente:');
      console.log('Teléfono:', customerPhone);
      console.log('Mensaje:', message);
      console.log('URL:', whatsappURL);
      
      // Abrir WhatsApp en una nueva ventana
      window.open(whatsappURL, '_blank');
    } catch (error) {
      console.error('Error enviando mensaje de WhatsApp:', error);
    }
  }

  static sendOrderToBusiness(orderData: WhatsAppOrderData): void {
    try {
      const businessPhone = whatsappConfig.whatsapp.phoneNumber;
      const message = `🛍️ *Nuevo Pedido Recibido*\n\n` +
        `*Cliente:* ${orderData.customerName}\n` +
        `*Teléfono:* ${orderData.customerPhone}\n` +
        `*Pedido #:* ${orderData.orderNumber}\n\n` +
        `*Productos:*\n${this.formatOrderDetails(orderData.orderItems)}\n\n` +
        `*Total:* $${orderData.totalAmount.toFixed(2)}\n\n` +
        `_Mensaje generado automáticamente desde la tienda online_`;
      
      const encodedMessage = encodeURIComponent(message);
      const whatsappURL = `https://wa.me/${businessPhone.replace('+', '')}?text=${encodedMessage}`;
      
      console.log('📱 Enviando notificación de pedido al negocio:');
      console.log('Teléfono del negocio:', businessPhone);
      console.log('Mensaje:', message);
      console.log('URL:', whatsappURL);
      
      // Abrir WhatsApp en una nueva ventana
      window.open(whatsappURL, '_blank');
    } catch (error) {
      console.error('Error enviando notificación al negocio:', error);
    }
  }

  static getBusinessInfo() {
    return whatsappConfig.whatsapp.businessInfo;
  }

  static getMessages() {
    return whatsappConfig.whatsapp.messages;
  }

  static getSampleChatData() {
    return whatsappConfig.sampleData.chatMessages;
  }
}