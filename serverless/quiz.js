const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
            "type": "object",
            "properties": {
                "quiz": {
                    "type": "object",
                    "properties": {
                        "questions": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "question": {
                                        "type": "string"
                                    },
                                    "options": {
                                        "type": "array",
                                        "items": {
                                            "type": "string"
                                        }
                                    },
                                    "correctAnswer": {
                                        "type": "string"
                                    }
                                },
                                "required": [
                                    "question",
                                    "options",
                                    "correctAnswer"
                                ]
                            }
                        }
                    },
                    "required": [
                        "questions"
                    ]
                }
            },
            "required": [
                "quiz"
            ]
        }
    },
});


const generateQuizPrompt = (data) => {
    return `
        Generate a JSON-formatted quiz questions based on the given lecture's title. One question for each lecture title.

        Lecture Title:
        ${JSON.stringify(data)}

        The quiz should be in the following format:
        {
            "questions": [
                {
                    "question": "Sample question?",
                    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
                    "correctAnswer": "Option 1"
                },
                {
                    "question": "Sample question?",
                    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
                    "correctAnswer": "Option 1"
                },
                ...
            ]
        }
    `;
};

const generateContent = async (prompt) => {
    const result = await model.generateContent(prompt, {
        temperature: 1.0,
        top_p: 0.9,
        max_tokens: 2000000,
    });
    return JSON.parse(result.response.text());
};

const generateQuiz = async (id) => {
    const courses = fs.readFileSync(path.join(__dirname, `..`, `/public/courses/content/${id}.json`));
    const titles = JSON.parse(courses).course.lectures.map((lecture) => lecture.title);
    let requests = 0

    while (requests < 3) {
        try {
            const quiz = await generateContent(generateQuizPrompt(titles));
            fs.writeFileSync(path.join(__dirname, `..`, `/public/courses/quiz/${id}.json`), JSON.stringify(quiz));
            return true
        } catch (error) {
            console.log(error.message);
            requests++
            continue
        }
    }
};


module.exports = { generateQuiz }