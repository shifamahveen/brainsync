const fetch = require('node-fetch');
require('dotenv').config();

const chatController = async (req, res) => {
    const { userInput } = req.body;

    if (!userInput || typeof userInput !== 'string' || userInput.trim() === '') {
        return res.render('index', {
            response: 'Please provide a valid input.',
            user: req.session.user || null,
        });
    }

    if (userInput.length > 500) {
        return res.render('index', {
            response: 'Input is too long. Please limit to 500 characters.',
            user: req.session.user || null,
        });
    }

    const apiKey = process.env.RAPIDAPI_KEY;
    if (!apiKey) {
        return res.render('index', {
            response: 'Server configuration issue. Please try again later.',
            user: req.session.user || null,
        });
    }

    const url = 'https://chatgpt-best-api.p.rapidapi.com/ask';
    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'chatgpt-best-api.p.rapidapi.com',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: userInput.trim(),
            model: 'gpt-4o',
            max_tokens: 100,
            temperature: 0.9,
        }),
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            return res.render('index', {
                response: 'Failed to get a valid response from the API. Please try again later.',
                user: req.session.user || null,
            });
        }

        const result = await response.json();
        res.render('index', {
            response: result.response || 'No response from the API.',
            user: req.session.user || null,
        });
    } catch (error) {
        res.render('index', {
            response: 'Error processing your request. Please try again later.',
            user: req.session.user || null,
        });
    }
};

module.exports = { chatController };
