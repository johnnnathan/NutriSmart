
# Grocery List App

## Overview
The **Grocery List App** is a platform designed to simplify grocery shopping and nutritional analysis. It allows users to easily analyze the macronutrient profile of food items and make healthier choices. The app is built with a user-friendly interface and offers AI-driven features for enhanced functionality.

## Features
- **Smart Grocery List**: Allows users to create, modify, and view grocery lists.
- **Nutritional Analysis**: Provides detailed nutritional information about food items.
- **AI-Driven Food Categorization**: Uses an AI model to suggest additional categories for food items based on their names.
- **Scoring System**: Food items are scored based on their nutritional profiles, similar to the Dutch Nutri-Score system. The scoring system ranges from A to D.

## Technologies Used
- **Frontend**: React.js
- **Backend**: Python (Flask for API)
- **AI Model**: Rule-based AI system for nutritional scoring and category suggestions
- **Database**: Local JSON or API-based storage for food data

## Installation

### Clone the Repository
```bash
git clone https://github.com/Amir-Mohseni/grocery-list-app
```

### Install Dependencies
1. Navigate tot he project directory: 

```bash
cd grocery-list-app
```
2. Install Python Dependencies:
```bash 
pip install -r src/requirements.txt
```


3. Install Node.js dependencies for the frontend:
```bash 
npm install
```

### Setup and Run the Application 

1. Start the backend server for the scoring system:
```bash 
python src/food_rater.py
```

2. Start the React Application:
```bash 
npm start
```
This will open the application in your default browser.





## How to Use
1. **Create a Grocery List**: Add items to your list by typing their names into the search bar.
2. **View Nutritional Information**: After adding an item to the list, click on it to view its nutritional profile.
3. **AI Food Categorization**: The app suggests possible categories for each food item based on its name and nutritional profile.
4. **Scoring System**: Each food item is rated from A to D based on its nutritional value. The higher the score, the healthier the item.

## Future Improvements
- **Augmented Reality (AR) Integration**: To allow real-time food identification via a front-facing camera.
- **Enhanced AI Features**: More advanced AI models for food categorization and personalized recommendations.
- **Mobile Application**: Porting the app to mobile platforms for on-the-go use.

## Contributors
- **Amir Mohseni**
- **Dimitrios Tsiplakis**

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- **Nutri-Score System**: The scoring system is inspired by the Dutch Nutri-Score system.
- **Shapley Additive Explanations (SHAP)**: For the AI model transparency and explainability.
