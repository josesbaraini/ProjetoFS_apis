// whatsapp.js
export default async function enviarWhatsapp(mensagem) {
    const instanceId = process.env.WHATSZAP_TOKEN;
    const token = process.env.WHATSZAP_INSTANCE;
    const numero = process.env.WHATSZAP_NUMBER;
  
    const url = `https://api.ultramsg.com/${instanceId}/messages/chat?token=${token}&to=${numero}&body=${encodeURIComponent(mensagem)}`;
  
    try {
      const res = await fetch(url);
      const data = await res.json();
      console.log('[WhatsApp] Mensagem enviada:', data);
    } catch (err) {
      console.error('[WhatsApp] Falha ao enviar mensagem:', err.message);
    }
    
  }


  