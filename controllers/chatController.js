const fetch = require('node-fetch');

const chatController = async (req, res) => {
    const { userInput } = req.body;

    // Validate user input
    if (!userInput || typeof userInput !== 'string' || userInput.trim() === '') {
        console.error('Invalid or empty user input');
        return res.render('index', { response: 'Please provide a valid input.' });
    }

    const url = 'https://chatgpt-best-api.p.rapidapi.com/ask';
    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': 'c61d2a41e6msha677143a858cee4p1bd26ejsn166a6ee3f3ef',
            'x-rapidapi-host': 'chatgpt-best-api.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: userInput.trim(),  // Change 'messages' to 'query'
            model: 'gpt-4o',
            max_tokens: 100,
            temperature: 0.9
        })
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        // Check if the API response contains the expected structure
        if (!result || !result.response) {
            console.error('Invalid API response structure:', result);
            return res.render('index', { 
                response: 'Failed to get a valid response. Please try again later.',
                user: req.session.user || null
            });
        }

        // Render the response from the API
        res.render('index', { 
            response: result.response, 
            user: req.session.user || null
        });
    } catch (error) {
        console.error('Error in chatController:', error.message);
        res.render('index', { 
            response: 'There was an error processing your request. Please try again later.',
            user: req.session.user || null
        });
    }
};

module.exports = { chatController };
