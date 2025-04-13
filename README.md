# SE200 Capstone Project

This is my personal capstone project for the SE200 course, where I redesign an outdated insurance system for Singapore Insurance.

## Overview

The project is divided into two parts:

- **Part 1 – Core App:**  
  Implements essential functionalities based on a [Figma design](https://www.figma.com/design/a0tiEr4j97liUAYErwYEvt/SE200-Capstone-Project-(Part-1)?node-id=0-1&t=2zxqBVO5gotRbDpW-1).  
  - Develops pages for viewing and adding insurance policies and policy holders.  
  - Integrates a database using Prisma and leverages Tailwind CSS for the UI.

- **Part 2 – Authentication & Dashboard:**  
  Adds account registration, login (via Authjs), and a dashboard that displays key metrics such as Total Customers, Total Policies, and Total Sales.


## Project Setup

1. **Clone the Repository:**

    ```
    git clone https://github.com/Taasneemm/Tasneem-SE200-Capstone.git
    cd Tasneem-SE200-Capstone
    ```

2. **Install Dependencies:**

    ```
    npm install
    # or yarn install
    ```

3. **Configure Environment Variables:**

    Create a `.env` file in the root directory with:

    ```
    DATABASE_URL=your_database_connection_string
    AUTH_SECRET=your_auth_secret_key
    ```

4. **Set Up the Database:**

    ```
    npx prisma migrate dev --name init
    ```

5. **Run the Development Server:**

    ```
    npm run dev
    # or yarn dev
    ```

    Visit [http://localhost:3000](http://localhost:3000) in your browser to see the project in action.
