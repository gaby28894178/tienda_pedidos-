import whatsappConfig from '../data/whatsapp-config.json';

export interface OrderEmailData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  orderItems: Array<{
    productName: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  totalAmount: number;
  orderNumber: string;
  orderDate: string;
}

export class EmailService {
  private static formatOrderItems(items: OrderEmailData['orderItems']): string {
    return items.map(item => 
      `- ${item.productName} x${item.quantity} - $${item.price} c/u = $${item.total.toFixed(2)}`
    ).join('\n');
  }

  private static formatOrderNotification(data: OrderEmailData): string {
    const template = whatsappConfig.email.templates.orderNotification;
    return template.body
      .replace('{customerName}', data.customerName)
      .replace('{customerEmail}', data.customerEmail)
      .replace('{customerPhone}', data.customerPhone)
      .replace('{customerAddress}', data.customerAddress)
      .replace('{orderItems}', this.formatOrderItems(data.orderItems))
      .replace('{totalAmount}', data.totalAmount.toFixed(2))
      .replace('{orderDate}', data.orderDate);
  }

  private static formatCustomerConfirmation(data: OrderEmailData): string {
    const template = whatsappConfig.email.templates.customerConfirmation;
    return template.body
      .replace('{customerName}', data.customerName)
      .replace('{orderItems}', this.formatOrderItems(data.orderItems))
      .replace('{totalAmount}', data.totalAmount.toFixed(2));
  }

  static async sendOrderNotification(orderData: OrderEmailData): Promise<boolean> {
    try {
      // En un entorno real, aquí se enviaría el email usando un servicio como EmailJS, Nodemailer, etc.
      const emailBody = this.formatOrderNotification(orderData);
      const subject = whatsappConfig.email.templates.orderNotification.subject
        .replace('#{orderNumber}', orderData.orderNumber);
      
      console.log('📧 Email de notificación de pedido:');
      console.log('Para:', whatsappConfig.email.orderRecipient);
      console.log('Asunto:', subject);
      console.log('Contenido:', emailBody);
      
      // Simular envío exitoso
      return true;
    } catch (error) {
      console.error('Error enviando email de notificación:', error);
      return false;
    }
  }

  static async sendCustomerConfirmation(orderData: OrderEmailData): Promise<boolean> {
    try {
      // En un entorno real, aquí se enviaría el email de confirmación al cliente
      const emailBody = this.formatCustomerConfirmation(orderData);
      const subject = whatsappConfig.email.templates.customerConfirmation.subject
        .replace('#{orderNumber}', orderData.orderNumber);
      
      console.log('📧 Email de confirmación al cliente:');
      console.log('Para:', orderData.customerEmail);
      console.log('Asunto:', subject);
      console.log('Contenido:', emailBody);
      
      // Simular envío exitoso
      return true;
    } catch (error) {
      console.error('Error enviando email de confirmación:', error);
      return false;
    }
  }

  static getOrderRecipientEmail(): string {
    return whatsappConfig.email.orderRecipient;
  }

  static getSupportEmail(): string {
    return whatsappConfig.email.supportEmail;
  }
}