const pool = require('../config/db');

const stressController = {
    async getQuestionnaire(req, res) {
        const questions = [
            "How often do you feel overwhelmed by your responsibilities?",
            "Do you frequently feel anxious or on edge?",
            "How often do you have difficulty concentrating on tasks?",
            "Do you find yourself feeling irritable or easily frustrated?",
            "How often do you feel unmotivated or emotionally drained?",
            "Do you struggle to relax even when you have free time?",
            "How often do you experience negative thoughts or excessive worrying?",
            "Do you experience frequent headaches or body tension?",
            "How often do you have trouble falling asleep or staying asleep?",
            "Do you feel physically exhausted even after a full night’s rest?",
            "Have you noticed changes in your appetite (eating more or less than usual)?",
            "Do you experience frequent stomach issues, such as nausea or indigestion?",
            "How often do you feel shortness of breath or a racing heart without physical exertion?",
            "Have you been avoiding social interactions more than usual?",
            "Do you rely on unhealthy coping mechanisms (e.g., alcohol, smoking, overeating)?",
            "How often do you procrastinate or struggle with productivity?",
            "Have you noticed a decrease in activities that you once enjoyed?",
            "Do you feel like you have little or no control over your current situation?",
            "How often do you feel the need to withdraw from people or responsibilities?",
            "Have your work or daily tasks been negatively impacted by your stress levels?"
        ];

        // Shuffle and select 10 random questions
        const selectedQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, 10);

        res.render('stress/questionnaire', { user: req.session.user, questions: selectedQuestions });
    },    

    async submitQuestionnaire(req, res) {
        const { userId, responses } = req.body;

        // Store user responses
        await pool.query(
            'INSERT INTO questionnaire_responses (user_id, responses) VALUES (?, ?)',
            [userId, JSON.stringify(responses)]
        );

        // Redirect to MCQs
        res.redirect(`/stress/mcq?userId=${userId}`);
    },

    async getMCQs(req, res) {
        res.render('stress/mcq', { user: req.session.user });
    },

    async submitMCQs(req, res) {
        const { userId, responses } = req.body;

        // Store MCQ responses
        await pool.query(
            'INSERT INTO mcq_responses (user_id, responses) VALUES (?, ?)',
            [userId, JSON.stringify(responses)]
        );

        // Calculate stress level
        const stressLevel = Math.random() * 10; // Placeholder for actual analysis

        // Store stress level
        await pool.query(
            'INSERT INTO stress_levels (user_id, level) VALUES (?, ?)',
            [userId, stressLevel]
        );

        res.redirect(`/stress/result?userId=${userId}`);
    },

    async getStressResult(req, res) {
        const { userId } = req.query;
        const [rows] = await pool.query(
            'SELECT level FROM stress_levels WHERE user_id = ? ORDER BY id DESC LIMIT 1',
            [userId]
        );

        if (!rows.length) return res.redirect('/stress/questionnaire');

        const stressLevel = rows[0].level;
        res.render('stress/stressLevel', { stressLevel, user: req.session.user });
    },

    async getSolutions(req, res) {
        const { userId } = req.query;
        const [rows] = await pool.query(
            'SELECT level FROM stress_levels WHERE user_id = ? ORDER BY id DESC LIMIT 1',
            [userId]
        );
    
        if (!rows.length) return res.redirect('/stress/questionnaire');
    
        const stressLevel = rows[0].level;
        let solution = 'General relaxation techniques such as deep breathing and light stretching.';
    
        if (stressLevel > 8) {
            solution = `
                <strong>🚨 High Stress Detected!</strong><br><br>
                - Daily mindfulness & breathing exercises (10-15 min)<br>
                - Guided meditation & stress journaling 📖<br>
                - Professional therapy or counseling recommended 🩺<br>
                - Reduce workload and prioritize self-care 🛑<br>
                - Ensure proper nutrition, hydration, and sleep 😴`;
        } else if (stressLevel > 6) {
            solution = `
                <strong>⚠️ Moderate to High Stress</strong><br><br>
                - Engage in regular exercise (30 min/day) 🏃‍♂️<br>
                - Practice progressive muscle relaxation 💆‍♂️<br>
                - Join a hobby or social support group 🎨<br>
                - Avoid excessive caffeine and alcohol ☕🚫<br>
                - Monitor stress triggers and set boundaries ⏳`;
        } else if (stressLevel > 4) {
            solution = `
                <strong>🟡 Moderate Stress</strong><br><br>
                - Yoga or deep stretching exercises (3x a week) 🧘‍♀️<br>
                - Listen to calming music or nature sounds 🎶<br>
                - Improve work-life balance (set clear breaks) 🏖️<br>
                - Engage in positive social interactions 👫<br>
                - Practice gratitude journaling ✍️`;
        } else {
            solution = `
                <strong>✅ Low Stress - Maintain Well-being</strong><br>
                - Continue positive daily habits 🌿<br>
                - Regular walks and outdoor time 🚶‍♂️<br>
                - Light relaxation techniques as needed 🛀<br>
                - Stay connected with family & friends 📞<br>
                - Monitor stress levels periodically 📊`;
        }
    
        res.render('stress/solutions', { stressLevel, solution, user: req.session.user });
    },    

    async getFeedback(req, res) {
        res.render('stress/feedback', { user: req.session.user });
    },

    async submitFeedback(req, res) {
        const { userId, responses } = req.body;

        // Store feedback
        await pool.query(
            'INSERT INTO feedback (user_id, responses) VALUES (?, ?)',
            [userId, JSON.stringify(responses)]
        );

        // Check for negative feedback
        const negative = responses.includes('negative');
        if (negative) {
            await pool.query(
                'UPDATE stress_levels SET level = level - 1 WHERE user_id = ?',
                [userId]
            );
        }

        res.redirect('/stress/feedback');
    }
};

module.exports = stressController;
