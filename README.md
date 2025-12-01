# The Surveys!

install: npm i  
run: npm run dev

## Prologue

The Surveys! is a dynamic survey-generator app. Using a clean configuration UI, it generates customizable, multi-page surveys based on 5 different question types.

Tech stack:
React • TypeScript • Redux • Ant Design

## The core

The application consists of two layers:

1. Survey Builder (React): a full UI for configuring survey settings and building the list of questions.
2. Survey Runtime (Vanilla TypeScript): a lightweight script injected into the global scope, exposing a createSurvey() function used to render the actual survey based on the builder’s exported configuration.

This approach keeps the builder component-driven and interactive, while the final survey stays framework-agnostic and easily embeddable anywhere.

## Builder:

A configurable form that lets the user define:
• General survey settings:
• description visible at the top
• number of questions per page
• validation style (disabled buttons vs. highlighting unanswered required questions)
• Questions:
All question parameters are fully customizable, including open text limits, required flags, answer options, date boundaries, etc.

All configurations are stored in Redux and synchronized into a JSON used later to launch the survey preview.

## Survey:

The survey is rendered as a paginated form with:
• 5 supported question types
• a global description
• client-side validation
• a final summary/thank-you page
• console logging of submitted results (for now)

## Next steps:

Planned improvements include:
• Backend for storing multiple surveys
• Publishing / sharing surveys
• Collecting responses
• Dashboard for analytics & results visualisation
