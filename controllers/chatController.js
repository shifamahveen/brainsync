const fetch = require('node-fetch');
require('dotenv').config();

const chatController = async (req, res) => {
    const { presentLocation, tourLocation, budget, days, transport } = req.body;

    // Validate input fields
    if (!presentLocation || !tourLocation || !budget || !days || !transport) {
        return res.render('index', {
            response: '❌ Please fill in all fields.',
            user: req.session.user || null,
        });
    }

    // Ensure budget and days are positive numbers
    if (isNaN(budget) || isNaN(days) || budget <= 0 || days <= 0) {
        return res.render('index', {
            response: '⚠️ Please enter valid numbers for budget and days.',
            user: req.session.user || null,
        });
    }

    const apiKey = process.env.RAPIDAPI_KEY;
    if (!apiKey) {
        return res.render('index', {
            response: '🚨 Server configuration issue. Please try again later.',
            user: req.session.user || null,
        });
    }

    const url = 'https://chatgpt4-ai-chatbot.p.rapidapi.com/ask';
    const query = `
        I am in ${presentLocation}. I want to visit ${tourLocation} with a budget of ${budget} Rs for ${days} days using ${transport} transport.
        Provide:
        - 🏞️ Best places to visit
        - 🚌 Transport options
        - 🍽️ Budget-friendly food recommendations
        - 🏠 Accommodation details
        - 📅 A detailed daily schedule
        - 🌟 Hidden gems & local experiences
        - 💰 Final Budget Summary: Calculate the approximate cost breakdown for food, travel, and accommodation, and display the remaining balance.
    `;

    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'chatgpt4-ai-chatbot.p.rapidapi.com',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            console.error(`🚨 API Error: ${response.status} - ${response.statusText}`);
            return res.render('index', {
                response: '⚠️ Failed to get a response from the AI. Please try again later.',
                user: req.session.user || null,
            });
        }

        const result = await response.json();
        console.log("🔹 API Response:", result);

        let responseMessage = result.response || result.result || "⚠️ No response from the AI.";

        // Format AI Response to ensure icons remain in the same line as the headings
        responseMessage = responseMessage
            .replace(/Best places to visit:/gi, '🏞️ Best Places to Visit:')
            .replace(/Transport options:/gi, '🚌 **Transport Options:**')
            .replace(/Budget-friendly food recommendations:/gi, '🍽️ **Food Recommendations:**')
            .replace(/Accommodation details:/gi, '🏠 **Accommodation Details:**')
            .replace(/A detailed daily schedule:/gi, '📅 **Daily Schedule:**')
            .replace(/Hidden gems & local experiences:/gi, '🌟 **Hidden Gems & Local Experiences:**')
            .replace(/Final Budget Summary:/gi, '💰 **Final Budget Summary:**')
            .replace(/\d+\./g, "-") // Replace numbered points with dashes for consistency
            .replace(/•/g, "-") // Replace bullet points with dashes
            .replace(/\n/g, '<br>') // Ensure new lines are converted to HTML line breaks
            .replace(/:\s*<br>/g, ":<br>- "); // Ensures dashes align properly under each section

        res.render('result', {
            response: responseMessage,
            user: req.session.user || null,
            presentLocation,
            tourLocation,
            budget,
            days,
            transport
        });

    } catch (error) {
        console.error("❌ Fetch Error:", error);
        res.render('index', {
            response: '🚨 Error processing your request. Please try again later.',
            user: req.session.user || null,
        });
    }
};

module.exports = { chatController };
