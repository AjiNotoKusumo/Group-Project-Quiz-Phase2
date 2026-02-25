
const { Category, Question } = require('../models');

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
}

module.exports = Controller;
