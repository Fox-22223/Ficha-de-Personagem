// Este código assume que o formulário possui o id 'fichaForm'
document.getElementById('fichaForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const file = formData.get('aparencia'); // Se você estiver enviando uma imagem
  const nome = formData.get('nome');
  const raca = formData.get('raca');
  const idade = formData.get('idade');
  const historia = formData.get('historia');
  const poderes = formData.get('poderes');
  const fraquezas = formData.get('fraquezas');
  const extras = formData.get('extras');

  // Verificar se a imagem foi enviada e fazer upload para o Imgur
  const imgurUploadResponse = await uploadToImgur(file);
  const imgurLink = imgurUploadResponse?.data?.link;

  if (!imgurLink) {
    alert('Falha no upload da imagem.');
    return;
  }

  // Enviar os dados para o servidor onde o bot está
  try {
    const response = await fetch('http://localhost:3000/ficha', {  // Substitua com o URL do seu servidor
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome,
        raca,
        idade,
        historia,
        poderes,
        fraquezas,
        extras,
        imagemUrl: imgurLink
      })
    });

    const result = await response.json();
    if (response.ok) {
      alert('Ficha enviada com sucesso!');
    } else {
      alert('Erro ao enviar a ficha!');
    }
  } catch (error) {
    console.error('Erro ao enviar a ficha:', error);
    alert('Erro ao enviar a ficha para o servidor.');
  }

  e.target.reset();
});

// Função para enviar a imagem para o Imgur
async function uploadToImgur(file) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('https://api.imgur.com/3/image', {
    method: 'POST',
    headers: {
      'Authorization': 'Client-ID 20907a449c20808'  // Substitua com a sua Client-ID do Imgur
    },
    body: formData
  });

  return await response.json();
}
