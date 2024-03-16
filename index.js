const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();

app.use(cors());

app.listen(4000, () => {
    console.log('Server Works !!! At port 4000');
});

app.get('/stream', async (req, res) => {
    const URL = req.query.URL;
    const title = req.query.title;

    try {
        const info = await ytdl.getInfo(URL);
        const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');

        if (audioFormats.length === 0) {
            throw new Error('No audio formats available');
        }

        const audioFormat = audioFormats[0];

        res.setHeader('Content-Type', 'audio/mp3');
        res.setHeader('Content-Disposition', `inline; filename="${title}.mp3"`);

        ytdl(URL, { format: audioFormat })
            .on('error', (err) => {
                console.error('Error during streaming:', err);
                res.status(500).send('Error during streaming');
            })
            .pipe(res);
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).send('Error: ' + err.message);
    }
});
