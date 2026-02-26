
const { Category, Question } = require('../models');
const { GoogleGenAI } = require("@google/genai");

class Controller {
    static async getCategories(req, res) {
        try {
            const categories = await Category.findAll();
            console.log(categories);
            
            res.status(200).json(categories);
        } catch (error) {
            console.log(error);
            
        }
    }

    static async getQuestions(req, res) {
        try {
            const questions = await Category.findOne({
                include: [{
                    model: Question,
                  
                }
            ],
             where : {id : req.params.id}
            });
            res.status(200).json(questions);
        } catch (error) {
            console.log(error);
            
        }
    }




    static async  generateHint(req, res) {
        try {

            const questions = await Category.findOne({
                include: [{
                    model: Question,
                  
                }
            ],
             where : {id : req.params.id}
            });

            const ai = new GoogleGenAI({
                apiKey: process.env.GOOGLE_API_KEY,
            });
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                generationConfig: { 
                    responseMimeType: "application/json", // Forces JSON output
                    maxOutputTokens: 500,
                    temperature: 0.7 
                },
                contents: `
                    System: Act as a helpful teacher for toddlers.
                    Task: Generate one "baby language" hint for each question.

                    Rules:
                    1. NEVER use the answer or any choice words in the hint.
                    2. Max 8 words per hint.
                    3. Maintain the EXACT order of the input list.
                    4. Output MUST be a valid JSON array of strings: ["hint1", "hint2", ...]
                    5. No intro, no outro, just the JSON.
                    6. Use extremely simple words (ELI5). 
                    7. Be very literal and helpful.

                    Example Hint Style: 
                    - For Tokyo: "The biggest city in Japan."
                    - For Mars: "The planet that is red."
                    
                Input Data: ${JSON.stringify(questions.Questions.map(q => ({ q: q.text, a: q.answer })))}
                `,
            });
            console.log(response.text);
            res.status(200).json({ hint: JSON.parse(response.text) });
        } catch (error) {
            throw error
        }
    }
    }

module.exports = Controller;
