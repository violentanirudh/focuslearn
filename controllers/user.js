const axios = require('axios')
const Requests = require('../models/requests')

async function handleImport(req, res) {
    const { course } = req.body;
    if (!course) return res.status(400).json({ error: "URL is required" });

    try {

        const urlParams = new URLSearchParams(course);
        const list = urlParams.get('list');

        console.log(list)

        const response = await axios.get("https://www.googleapis.com/youtube/v3/playlistItems", {
            params: {
                playlistId: list,
                key: process.env.YOUTUBE_API_KEY,
            },
        });
            
        if (response.data.items.length > 0) {
            await Requests.create({
                playlistId: list,
                requestedBy: req.user._id,
            });
            return res.redirect("/import-course");
        } else {
            return res.status(404).json({ error: "Playlist not found" });
        }
    } catch (error) {
        console.log(error.message)
        return res.status(500).redirect('/import-course')
    }
}

module.exports = {
    handleImport
}