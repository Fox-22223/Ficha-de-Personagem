document.getElementById('fichaForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const file = formData.get('aparencia');

    // Cria uma instância FormData para enviar a imagem
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

    // Dados que serão enviados para o bot no servidor
    const data = {
        nome: nome,
        raca: raca,
        idade: idade,
        historia: historia,
        poderes: poderes,
        fraquezas: fraquezas,
        extras: extras,
        imagem: imgurLink
    };

    // Enviar para o servidor do bot
    await fetch('/sendFicha', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(responseData => {
        alert(responseData.message);
        e.target.reset();
    })
    .catch(error => {
        console.error('Erro ao enviar ficha para o bot:', error);
        alert('Erro ao enviar ficha!');
    });
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
