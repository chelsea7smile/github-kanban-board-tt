GitHub Kanban Board

GitHub Kanban Board is a web application that displays GitHub repository issues as a Kanban board.
The application is built using React 18, TypeScript, Ant Design (for UI), dnd-kit (for drag-and-drop), and Zustand (for state management) and Cypress for tests.

Getting Started

Prerequisites
•Node.js (v14 or higher is recommended)
 
•npm or Yarn

1. Clone the Repository

`git clone https://github.com/chelsea7smile/github-kanban-board-tt.git`

`cd github-kanban-board-tt`

2. Install Dependencies

Using npm:

`npm install`

Or using Yarn:

`yarn install`

3. Set Up Environment Variables

Create a .env file in the root of your project and add your GitHub personal access token (PAT):

`REACT_APP_GITHUB_TOKEN=your_personal_github_token_here`

Note:

To generate a GitHub PAT, go to your GitHub account settings → Developer settings → Personal access tokens and create a new token with read-only permissions for public repositories.
If you’re using Vite, use VITE_GITHUB_TOKEN and access it via import.meta.env.VITE_GITHUB_TOKEN.

4. Run the Application Locally

Using npm:

`npm start`

Or using Yarn:

`yarn start`

The application will run at http://localhost:3000.

5. Run End-to-End Tests with Cypress

To open Cypress:

`npm run cypress:open`

Or

`yarn cypress:open`

	Note: Drag-and-drop functionality might not be fully covered in tests.


This README provides all the necessary instructions to run the project locally and details the implemented requirements.
