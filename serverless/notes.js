const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});


const generateNotesPrompt = (data) => {
    return `
        Generate a markdown notes based on the given lecture's title. Generate notes string for each lecture title. Each lecture should have descriptive notes with examples.

        Lecture Title:
        ${JSON.stringify(data)}
    `;
};

const generateContent = async (prompt) => {
    const result = await model.generateContent(prompt, {
        temperature: 1.0,
        top_p: 0.9,
        max_tokens: 5000000,
    });
    return result.response.text();
};

const generateNotes = async (id) => {
    const courses = fs.readFileSync(path.join(__dirname, `..`, `/public/courses/content/${id}.json`));
    const titles = JSON.parse(courses).course.lectures.map((lecture) => lecture.title);
    let requests = 0

    while (requests < 3) {
        try {
            const quiz = await generateContent(generateNotesPrompt(titles));
            fs.writeFileSync(path.join(__dirname, `..`, `/public/courses/notes/${id}.txt`), quiz);
            return true
        } catch (error) {
            console.log(error.message);
            requests++
            continue
        }
    }
};


module.exports = { generateNotes }