const webhookURL = 'https://discord.com/api/webhooks/1371132616715141170/P6CMU19t43eQm3fuMSXOxFSpg0Braq08aJdbKnc_RgB12X0nJyl-let0BZgXtrjtfvzr';

document.getElementById('fichaForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const file = formData.get('aparencia');

  const imgurUploadResponse = await uploadToImgur(file);
  const imgurLink = imgurUploadResponse?.data?.link;

  if (!imgurLink) {
    alert('Falha no upload da imagem.');
    return;
  }

  const nome = formData.get('nome');
  const raca = formData.get('raca');
  const idade = formData.get('idade');
  const historia = formData.get('historia');
  const poderes = formData.get('poderes');
  const fraquezas = formData.get('fraquezas');
  const extras = formData.get('extras');

  const data = {
    content: `📜 **Ficha de Personagem Submetida**`,
    embeds: [{
      title: `Ficha de ${nome}`,
      description: `**Raça**: ${raca}\n**Idade**: ${idade}`,
      fields: [
        { name: 'História', value: historia || 'Não fornecido', inline: true },
        { name: 'Poderes', value: poderes || 'Não fornecido', inline: true },
        { name: 'Fraquezas', value: fraquezas || 'Não fornecido', inline: true },
        { name: 'Extras (OFF)', value: extras || 'Não fornecido', inline: true },
      ],
      image: { url: imgurLink },
      color: 0x660000,
      footer: { text: 'Ficha Sombria - RP' }
    }]
  };

  await fetch(webhookURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  alert('Ficha enviada com sucesso!');
  e.target.reset();
});

async function uploadToImgur(file) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('https://api.imgur.com/3/image', {
    method: 'POST',
    headers: {
      'Authorization': 'Client-ID 20907a449c20808'
    },
    body: formData
  });

  return await response.json();
}
