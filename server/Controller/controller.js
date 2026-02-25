
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
            const questions = await Category.findAll({
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
            const {prompt} = req.body
            const ai = new GoogleGenAI({
                apiKey: process.env.GOOGLE_API_KEY,
            });
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: "Explain how AI works in a few words",
            });
            console.log(response.text);
            res.status(200).json({ hint: response.text });
        } catch (error) {
            console.log(error);
        }
    }
    }

module.exports = Controller;
