const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

app.use(express.json());

// URL do Webhook do Discord
const WEBHOOK_URL = 'https://discord.com/api/webhooks/SEU_WEBHOOK_AQUI';

// Endpoint para receber a ficha e enviar ao Discord
app.post('/sendFicha', async (req, res) => {
    const { nome, raca, idade, historia, poderes, fraquezas, extras, imagem } = req.body;

    const embed = {
        title: `🧩 Ficha de ${nome}`,
        color: 0x2f3136,
        fields: [
            { name: "🧬 Raça", value: raca },
            { name: "⏳ Idade (aparente/real)", value: idade },
            { name: "📖 História", value: historia },
            { name: "✨ Poderes", value: poderes },
            { name: "⚠️ Fraquezas", value: fraquezas },
            { name: "🧾 Extras (OFF)", value: extras || "Nenhum" }
        ],
        image: { url: imagem },
        timestamp: new Date(),
    };

    try {
        // Enviar os dados para o Webhook do Discord
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: "Envio de Ficha",
                avatar_url: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                embeds: [embed],
            }),
        });

        if (!response.ok) {
            throw new Error('Erro ao enviar para o Discord');
        }

        res.json({ message: 'Ficha enviada com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar para o Discord:', error);
        res.status(500).json({ message: 'Erro ao enviar ficha para o Discord.' });
    }
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
