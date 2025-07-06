// whatsapp.js
export default async function enviarWhatsapp(mensagem) {
    const instanceId = 'instance130414';
    const token = '1wcvxn4e6tkrry4k';
    const numero = '5569981179389';
  
    const url = `https://api.ultramsg.com/${instanceId}/messages/chat?token=${token}&to=${numero}&body=${encodeURIComponent(mensagem)}`;
  
    try {
      const res = await fetch(url);
      const data = await res.json();
      console.log('[WhatsApp] Mensagem enviada:', data);
    } catch (err) {
      console.error('[WhatsApp] Falha ao enviar mensagem:', err.message);
    }
    
  }
  