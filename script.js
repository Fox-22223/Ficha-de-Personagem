const webhookURL = 'https://discord.com/api/webhooks/1371132616715141170/P6CMU19t43eQm3fuMSXOxFSpg0Braq08aJdbKnc_RgB12X0nJyl-let0BZgXtrjtfvzr';

document.getElementById('fichaForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const file = formData.get('aparencia');

  if (file) {
    const imgurUploadResponse = await uploadToImgur(file);
    const imgurLink = imgurUploadResponse?.data?.link;

    if (!imgurLink) {
      alert('Falha no upload da imagem.');
      return;
    }
  } else {
    alert('Por favor, carregue uma imagem.');
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
        { name: 'História', value: historia || 'Não fornecido', inline: false },
        { name: 'Poderes', value: poderes || 'Não fornecido', inline: true },
        { name: 'Fraquezas', value: fraquezas || 'Não fornecido', inline: true },
        { name: 'Extras (OFF)', value: extras || 'Não fornecido', inline: true },
      ],
      image: { url: imgurLink }, // Link da imagem enviada
      color: 0x660000,
      footer: { text: 'Ficha Sombria - RP' }
    }]
  };

  try {
    const response = await fetch(webhookURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      alert('Ficha enviada com sucesso!');
      e.target.reset();
    } else {
      alert('Erro ao enviar a ficha. Tente novamente.');
    }
  } catch (error) {
    alert('Ocorreu um erro ao enviar a ficha. Verifique sua conexão e tente novamente.');
  }
});

async function uploadToImgur(file) {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        'Authorization': 'Client-ID 20907a449c20808'
      },
      body: formData
    });

    const result = await response.json();

    if (!response.ok) {
      alert('Erro ao fazer upload da imagem.');
      return null;
    }

    return result;
  } catch (error) {
    alert('Erro ao tentar fazer o upload da imagem. Tente novamente.');
    return null;
  }
}
