import React, { useState, useEffect } from 'react';
import './MacronutrientAnalyzer.css'; // Ensure you style the menu as needed
import { Link } from 'react-router-dom';

const MacronutrientAnalyzer = () => {
  const [foodData, setFoodData] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedResults, setDisplayedResults] = useState(10);
  const [selectedFood, setSelectedFood] = useState(null);
  const [foodScore, setFoodScore] = useState(null);
  const [categoryFilters, setCategoryFilters] = useState({
    'American Indian': false,
    'Baby Foods': false,
    'Baked Foods': false,
    Beverages: false,
    'Beans and Lentils': false,
    'Breakfast Cereals': false,
    'Dairy and Egg Products': false,
    'Fast Foods': false,
    Fish: false,
    Fruits: false,
    'Fats and Oils': false,
    'Grains and Pasta': false,
    Meats: false,
    'Nuts and Seeds': false,
    'Prepared Meals': false,
    'Restaurant Foods': false,
    Snacks: false,
    'Soups and Sauces': false,
    Sweets: false,
    'Spices and Herbs': false,
    Vegetables: false
  });

  // Load CSV data and parse it into an array
  useEffect(() => {
    async function loadCSV() {
      const response = await fetch(process.env.PUBLIC_URL + '/food_data.csv');
      const data = await response.text();
      const rows = data.split('\n').slice(1);

      const parsedData = rows.map(row => {
        const columns = row.split(',');

        const foodItem = {
          id: columns[0],
          name: columns[1], // Food name
          category: columns[2], // Food group
          calories: parseFloat(columns[3]) || 0, // Calories (kcal)
          fat: parseFloat(columns[4]) || 0, // Fat (g)
          protein: parseFloat(columns[5]) || 0, // Protein (g)
          carbs: parseFloat(columns[6]) || 0, // Carbohydrates (g)
          sugars: parseFloat(columns[7]) || 0, // Sugars (g)
          fiber: parseFloat(columns[8]) || 0, // Fiber (g)
          cholesterol: parseFloat(columns[9]) || 0, // Cholesterol (mg)
          saturatedFats: parseFloat(columns[10]) || 0, // Saturated Fats (g)
          calcium: parseFloat(columns[11]) || 0, // Calcium (mg)
          iron: parseFloat(columns[12]) || 0, // Iron (mg)
          potassium: parseFloat(columns[13]) || 0, // Potassium (mg)
          magnesium: parseFloat(columns[14]) || 0, // Magnesium (mg)
          vitaminA: parseFloat(columns[15]) || 0, // Vitamin A (IU)
          vitaminC: parseFloat(columns[17]) || 0, // Vitamin C (mg)
          vitaminD: parseFloat(columns[19]) || 0, // Vitamin D (mcg)
          omega3: parseFloat(columns[24]) || 0, // Omega-3 (mg)
          omega6: parseFloat(columns[25]) || 0, // Omega-6 (mg)
          predictedGroup1: columns[118], // DN (Predicted Food Group 1)
          predictedGroup2: columns[119], // DO (Predicted Food Group 2)
          predictedGroup3: columns[120], // DP (Predicted Food Group 3)
        };

        console.log(foodItem); // Log each food item for debugging
        return foodItem;
      });

      setFoodData(parsedData);
    }

    loadCSV();
  }, []);

  // Filter food data based on search term and selected filters
  useEffect(() => {

    const filtered = foodData.filter(food => {
        if (!food || !food.name) return false; // Skip undefined or invalid food items

        const matchesSearchTerm = food.name.toLowerCase().includes(searchTerm.toLowerCase());

        // Exclude items based on category filters
        const isFilteredOut = Object.entries(categoryFilters).some(([category, isChecked]) => {
            return isChecked && (food.category === category ||
                food.predictedGroup1 === category ||
                food.predictedGroup2 === category ||
                food.predictedGroup3 === category);
        });

        return matchesSearchTerm && !isFilteredOut;
    });
    // Sort the filtered foods alphabetically by name length
    filtered.sort((a, b) => {
      if (a.name.length === b.name.length) {
        return a.name.localeCompare(b.name);
      }
      return a.name.length - b.name.length;
    });

    setFilteredFoods(filtered);
    setDisplayedResults(10); // Reset to showing 10 results
    setSelectedFood(null); // Reset the selected food when filters/search change
  }, [searchTerm, foodData, categoryFilters]);

  // Handle checkbox toggle for each category filter
  const handleFilterChange = (category) => {
    setCategoryFilters(prevFilters => ({
      ...prevFilters,
      [category]: !prevFilters[category], // Toggle the current filter
    }));
  };

  // Display more results (increment by 10)
  const loadMoreResults = () => {
    setDisplayedResults(prev => prev + 10);
  };

  const activateFilters = () => {
    setCategoryFilters({
      'American Indian': true,
      'Baby Foods': true,
      'Baked Foods': true,
      Beverages: true,
      'Beans and Lentils': true,
      'Breakfast Cereals': true,
      'Dairy and Egg Products': true,
      'Fast Foods': true,
      Fish: true,
      Fruits: true,
      'Fats and Oils': true,
      'Grains and Pasta': true,
      Meats: true,
      'Nuts and Seeds': true,
      'Prepared Meals': true,
      'Restaurant Foods': true,
      Snacks: true,
      'Soups and Sauces': true,
      Sweets: true,
      'Spices and Herbs': true,
      Vegetables: true 
    });

  }
  // Reset all filters
  const resetFilters = () => {
    setCategoryFilters({
      'American Indian': false,
      'Baby Foods': false,
      'Baked Foods': false,
      Beverages: false,
      'Beans and Lentils': false,
      'Breakfast Cereals': false,
      'Dairy and Egg Products': false,
      'Fast Foods': false,
      Fish: false,
      Fruits: false,
      'Fats and Oils': false,
      'Grains and Pasta': false,
      Meats: false,
      'Nuts and Seeds': false,
      'Prepared Meals': false,
      'Restaurant Foods': false,
      Snacks: false,
      'Soups and Sauces': false,
      Sweets: false,
      'Spices and Herbs': false,
      Vegetables: false
    });
  };
  const [selectedPreset, setSelectedPreset] = useState('');


  useEffect(() => {
    if (selectedFood) {
      fetch(`http://localhost:5000/get_food_rating?food_id=${selectedFood.id}`)
        .then(response => response.json())
        .then(data => {
          console.log(data); // Log the entire response
          if (data && data.scaled_rating !== undefined) {
            setFoodScore(data.scaled_rating); // Update to use scaled_rating
          } else {
            console.error('Score not found in response:', data);
          }
        })
        .catch(error => {
          console.error('Error fetching food score:', error);
        });
    }
  }, [selectedFood]);

  // Show detailed view of a selected food item
  const showDetailedView = (food) => {
    setSelectedFood(food);
  };

  const getLetterGrade = (score) => {
    if (score >= 7.5) return 'A';
    if (score >= 5) return 'B';
    if (score >= 2.5) return 'C';
    return 'D';
  };

  // Get color based on letter grade
  const getScoreColor = (grade) => {
    switch (grade) {
      case 'A':
        return 'green';
      case 'B':
        return 'lightgreen';
      case 'C':
        return 'orange';
      case 'D':
        return 'red';
      default:
        return 'gray';
    }
  };
  const applyPreset = (preset) => {
    setSelectedPreset(preset);
    let newFilters = Object.fromEntries(
      Object.keys(categoryFilters).map(key => [key, false])
    );
    
    switch(preset) {
      case 'vegan':
        newFilters = {
          ...newFilters,
          'Dairy and Egg Products': true,
          'Fish': true,
          'Meats': true
        };
        break;
      case 'vegetarian':
        newFilters = {
          ...newFilters,
          'Fish': true,
          'Meats': true
        };
        break;
      case 'paleo':
        newFilters = {
          ...newFilters,
          'Dairy and Egg Products': true,
          'Grains and Pasta': true,
          'Baked Foods': true,
          'Sweets': true,
          'Prepared Meals': true,
          'Fast Foods': true
        };
        break;
      case 'keto':
        newFilters = {
          ...newFilters,
          'Grains and Pasta': true,
          'Fruits': true,
          'Sweets': true
        };
        break;
      default:
        break;
    }
    
    setCategoryFilters(newFilters);
  };

  return (
    <div className="analyzer-container">
      <Link to="/" className="home-button">Home</Link>
      <div className="menu-panel">
        <h2>Filters</h2>
        <div className="presets-filters">
          <h3>Dietary Presets</h3>
          <div className="preset-options">
            {['vegan', 'vegetarian', 'paleo', 'keto'].map(preset => (
              <label key={preset} className="preset-label">
                <input
                  type="radio"
                  name="preset"
                  value={preset}
                  checked={selectedPreset === preset}
                  onChange={() => applyPreset(preset)}
                />
                {preset.charAt(0).toUpperCase() + preset.slice(1)}
              </label>
            ))}
          </div>
        </div>
        <div className="filter-options">
          {/* Individual food category checkboxes */}
          {Object.keys(categoryFilters).map(category => (
            <label key={category}>
              <input
                type="checkbox"
                checked={categoryFilters[category]}
                onChange={() => handleFilterChange(category)}
              />
              {category}
            </label>
          ))}
        </div>
        <button onClick={activateFilters}> Activate All Filters </button>{ /* Activate All Filters Button*/}
        <button onClick={resetFilters}>Reset Filters</button> {/* Reset button */}
      </div>

      <div className="left-panel">
        <h1>Macronutrient Profile Scorer</h1>
        <input
          type="text"
          id="searchInput"
          placeholder="Search for a food item..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div id="results">
          {filteredFoods.slice(0, displayedResults).map(food => (
            food ? (
              <div
                key={food.name}
                className="food-item"
                onClick={() => showDetailedView(food)}
              >
                <h3>{food.name}</h3>
                <p>Calories: {food.calories} kcal</p>
                <p>Fat: {food.fat} g | Protein: {food.protein} g | Carbs: {food.carbs} g</p>
              </div>
            ) : null // Render nothing if food is undefined
          ))}
        </div>
        {filteredFoods.length > displayedResults && (
          <button id="showMoreBtn" onClick={loadMoreResults}>
            Show More
          </button>
        )}
      </div>


      {selectedFood && (
          <div className="right-panel" id="detailedView">
              <h2>{selectedFood.name}</h2>
              <ul>
                  <li><strong>Categories:</strong></li>
                  <li>{selectedFood.category}</li> {/* Main category */}
                  <li>{selectedFood.predictedGroup1}</li> {/* Predicted Food Group 1 */}
                  <li>{selectedFood.predictedGroup2}</li> {/* Predicted Food Group 2 */}
                  <li>{selectedFood.predictedGroup3}</li> {/* Predicted Food Group 3 */}
                  <li><strong>Calories:</strong> {selectedFood.calories} kcal</li>
                  <li><strong>Fat:</strong> {selectedFood.fat} g</li>
                  <li><strong>Protein:</strong> {selectedFood.protein} g</li>
                  <li><strong>Carbohydrates:</strong> {selectedFood.carbs} g</li>
                  <li><strong>Sugars:</strong> {selectedFood.sugars} g</li>
                  <li><strong>Fiber:</strong> {selectedFood.fiber} g</li>
                  <li><strong>Cholesterol:</strong> {selectedFood.cholesterol} mg</li>
                  <li><strong>Saturated Fats:</strong> {selectedFood.saturatedFats} g</li>
                  <li><strong>Vitamin A:</strong> {selectedFood.vitaminA} IU</li>
                  <li><strong>Vitamin C:</strong> {selectedFood.vitaminC} mg</li>
                  <li><strong>Vitamin D:</strong> {selectedFood.vitaminD} mcg</li>
                  <li><strong>Omega-3:</strong> {selectedFood.omega3} mg</li>
                  <li><strong>Omega-6:</strong> {selectedFood.omega6} mg</li>
                  {foodScore !== null && (
                    <div style={{ backgroundColor: getScoreColor(getLetterGrade(foodScore)), padding: '10px', borderRadius: '5px', color: 'white' }}>
                      <h4>Food Score: ({getLetterGrade(foodScore)})</h4>
                    </div>
                  )}
              </ul>


              <button onClick={() => setSelectedFood(null)}>Close</button>
          </div>
      )}
    </div>
  );
};

export default MacronutrientAnalyzer;
