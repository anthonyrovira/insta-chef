# Instachef 🍳

**Instachef** is a modern web application designed to help users discover recipes based on the ingredients they already have. With a user-friendly interface and efficient search capabilities, Instachef makes cooking easier and more enjoyable.

## Features

- **Ingredient-based Recipe Search**: Select ingredients you have, and Instachef will suggest recipes tailored to your selection.
- **Dynamic Recipe Cards**: View recipes in grid or list mode with key details such as ingredients and instructions.
- **Protected Routes**: Ensure secure access to personalized features like saved favorites.
- **Dark Mode Support**: Switch between light and dark themes seamlessly.
- **OAuth Integration**: Log in quickly using Google authentication powered by Supabase.
- **Responsive Design**: Optimized for desktop and mobile devices.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Icons**: Lucide React
- **State Management**: React Hooks
- **TypeScript**: Strict typing for a robust codebase

## Installation

### Prerequisites

- Node.js >= 18
- pnpm
- Supabase account for authentication setup
- [Spoonacular API key](https://spoonacular.com/food-api)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/instachef.git
   cd instachef

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up Supabase:
   - Create a .env.local file in the root directory.
   - Add your Supabase credentials and other necessary environment variables.
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   ```	

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open your browser and navigate to `http://localhost:3000` to see the application in action.


## Scripts

- `pnpm dev`: Run the development server.
- `pnpm build`: Build the application for production.
- `pnpm start`: Start the production server.


## Contributing

Contributions are welcome! Please feel free to submit a pull request.
To contribute:

1. Fork the repository.
2. Create a feature branch. (e.g. `feature/new-feature`)
3. Commit your changes.
4. Push your changes to your fork.
5. Submit a pull request.

## License

This project is open-sourced under the MIT License - see the LICENSE file for details.
