
const supabase = require('../config/supabaseClient');
require('dotenv').config();

const questions = [
    {
        question_text: "What is the capital of France?",
        choices: ["London", "Berlin", "Paris", "Madrid"],
        correct_choice: 2 // Paris
    },
    {
        question_text: "which planet is known as the Red Planet?",
        choices: ["Mars", "Venus", "Jupiter", "Saturn"],
        correct_choice: 0 // Mars
    },
    {
        question_text: "Who wrote 'Romeo and Juliet'?",
        choices: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
        correct_choice: 1 // Shakespeare
    },
    {
        question_text: "What is the largest mammal in the world?",
        choices: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
        correct_choice: 1 // Blue Whale
    },
    {
        question_text: "What is the chemical symbol for Gold?",
        choices: ["Au", "Ag", "Fe", "Cu"],
        correct_choice: 0 // Au
    },
    {
        question_text: "In which year did World War II end?",
        choices: ["1945", "1939", "1918", "1955"],
        correct_choice: 0 // 1945
    },
    {
        question_text: "What is the hardest natural substance on Earth?",
        choices: ["Gold", "Iron", "Diamond", "Platinum"],
        correct_choice: 2 // Diamond
    },
    {
        question_text: "Which programming language is known as the 'language of the web'?",
        choices: ["Python", "Java", "C++", "JavaScript"],
        correct_choice: 3 // JavaScript
    }
];

const seed = async () => {
    console.log('Seeding database...');

    // Check if questions exist
    const { data: existing, error: fetchError } = await supabase
        .from('quiz_questions')
        .select('id')
        .limit(1);

    if (fetchError) {
        console.error('Error checking DB:', fetchError);
        return;
    }

    if (existing.length > 0) {
        console.log('Database already has data. Skipping seed.');
        return;
    }

    const { data, error } = await supabase
        .from('quiz_questions')
        .insert(questions)
        .select();

    if (error) {
        console.error('Error seeding data:', error);
    } else {
        console.log(`Successfully added ${data.length} questions!`);
    }
    process.exit();
};

seed();
