# **App Name**: DripAdvisor AI

## Core Features:

- User Authentication: Secure user login with email/password and Google, including a convenient guest mode for quick access.
- Conversion-Optimized Landing Page: A visually striking landing page with a bold headline and a clear call-to-action button to engage users and encourage outfit generation.
- Personalized Input Form: A clean and fast form for users to input their preferences including height, weight, style, occasion, budget, and optional details like body type and preferred colors.
- AI Outfit Suggestion Tool: Leverages OpenAI API as a tool to generate 2-3 tailored outfit combinations (top, bottom, shoes, accessories) based on the user's profile and current request parameters.
- Interactive Results Page with Affiliate Links: Displays generated outfits as cards with item breakdowns, estimated price ranges, and direct affiliate shopping links to Amazon, Myntra, and Ajio for each item.
- Firebase Data Storage: Utilizes Firestore for persisting user profiles, storing outfit generation requests, saving AI-generated outfit details, and tracking monetization-related clicks.

## Style Guidelines:

- The visual scheme embraces a dark theme, utilizing a very dark, almost black background (HSL(40, 15%, 8%), converted to hex #191713), complemented by a rich, luxurious gold as the primary accent color (HSL(40, 80%, 60%), converted to hex #E6BB33). This combination evokes a sense of exclusivity and sophistication. An analogous accent color in a deep orange (HSL(10, 70%, 50%), converted to hex #D94C26) is used to draw attention to call-to-actions and key interactive elements.
- Headlines and prominent text will use 'Belleza', a humanist sans-serif, providing a stylish and high-fashion feel. Body text and supporting information will be rendered in 'Inter', a modern grotesque sans-serif, ensuring clear readability and a clean, contemporary aesthetic.
- Icons will be modern, minimalist, and sleek, employing a fine line-art style. This approach reinforces the premium and clean design, avoiding clutter and focusing on clear visual communication within the dark theme.
- Key screens such as the landing page and input form prioritize clean, uncluttered interfaces for swift user interaction. The results page will feature a card-based layout to clearly present outfit combinations, enhancing readability and navigation through various suggestions. Thoughtful spacing and hierarchy will be used throughout to emphasize important information and guide the user's eye.
- Smooth, subtle animations will be integrated to enhance the user experience, particularly during transitions between screens, on loading states (e.g., during AI outfit generation), and upon interactive elements. These animations are designed to feel polished and contribute to the overall premium application feel.