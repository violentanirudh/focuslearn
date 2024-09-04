const schema = {
    questions: {
        content: "Multiple Choice Question. Each title should have one Questions. Each question will have 3 options and one correct answer.",
        schema: `{
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
                    "answer": {
                        "type": "string",
                        "enum": [
                        "option1",
                        "option2",
                        "option3"
                        ]
                    },
                    "option1": {
                        "type": "string"
                    },
                    "option2": {
                        "type": "string"
                    },
                    "option3": {
                        "type": "string"
                    }
                    },
                    "required": [
                        "question",
                        "answer",
                        "option1",
                        "option2",
                        "option3"
                    ]
                }
                }
            },
            "required": [
                "questions"
            ]
        }`,
    },
}


module.exports = schema