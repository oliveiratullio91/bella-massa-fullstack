// O destinatário e o total vêm da API da equipe. Cada autorização vale para um único pedido.
function doPost(e) {
  var sent = false;
  try {
    var ticket = JSON.parse(e.postData.contents).ticket;
    if (typeof ticket !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(ticket)) throw new Error('Pedido inválido');
    var response = UrlFetchApp.fetch('https://bella-massa-demo.onrender.com/api/receipts/claim', {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({ ticket: ticket }),
      followRedirects: false,
      muteHttpExceptions: true
    });
    if (response.getResponseCode() === 200) {
      var receipt = JSON.parse(response.getContentText());
      var total = Number(receipt.total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      MailApp.sendEmail({
        to: receipt.email,
        subject: 'Bella Massa | Pedido #' + receipt.id + ' recebido',
        body: 'Recebemos seu pedido #' + receipt.id + '.\n\nTotal do pedido: ' + total + '.\n\nObrigado por pedir na Bella Massa!',
        name: 'Bella Massa'
      });
      sent = true;
    }
  } catch (error) {
    console.warn('A confirmação por e-mail não pôde ser concluída.');
  }
  return ContentService.createTextOutput(JSON.stringify({ sent: sent })).setMimeType(ContentService.MimeType.JSON);
}
