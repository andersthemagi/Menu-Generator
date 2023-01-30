const fs = require("fs");
const csv = require("@fast-csv/parse")

/* Importing JS files from /modules/ directory */
const Recipe = require("./modules/Recipe.js");

/* Constants */

const DAYS = 5;

const menu = [];
let recipes = [];
const primaryIngredientArr = [];

function readCSV(path, options, rowProcessor) {
  return new Promise((resolve, reject) => {
    const data = [];

    csv
      .parseFile(path, options)
      .on("error", reject)
      .on("data", (row) => {
        const obj = rowProcessor(row);
        if (obj) data.push(obj);
      })
      .on("end", () => {
        resolve(data);
      });
  });
}

function loadRecipes(recipeData) {

  // Load CSV items into Recipe items
  for (let i = 0; i < recipeData.length; i++) {
    const name = recipeData[i].name;
    const primaryIngredientStr = recipeData[i].primaryIngredient;

    // Check if Primary Ingredient exists in primaryIngredientArr
    let primaryIngredient = checkExistingPrimaryIngredient(
      primaryIngredientStr, primaryIngredientArr);

    // Log all primary ingredients
    if (primaryIngredient === undefined) {
      primaryIngredient = new Recipe.Ingredient(primaryIngredientStr);
      primaryIngredientArr.push(primaryIngredient);
    }
    const newRecipe = new Recipe.Recipe(name, primaryIngredient);
    recipes.push(newRecipe);
  }
}

function checkExistingPrimaryIngredient(inStr, primaryIngredients) {
  for (let i = 0; i < primaryIngredients.length; i++) {
    if (primaryIngredients[i].name === inStr) {
      return primaryIngredients[i];
    }
  }
  return undefined;
}

function isValidPrimaryIngredient(inIngredient, validPrimaries) {
  for (let i = 0; i < validPrimaries.length; i++) {
    if (inIngredient.name === validPrimaries[i].name) {
      return true;
    }
  }
  return false;
}

function shuffle(array) {
  let i = array.length;
  while (i--) {
    const ri = Math.floor(Math.random() * i);
    [array[i], array[ri]] = [array[ri], array[i]];
  }
  return array;
}

async function main() {
  // Parse CSV
  const recipeData = await readCSV(
    "recipes.csv",
    { skipRows: 1 },
    (row) => ({ name: row[0], primaryIngredient: row[1] })
  );

  loadRecipes(recipeData);

  // Shuffle Recipes
  recipes = shuffle(recipes);

  // Copy all Primary Ingredients 
  let validPrimaries = [...primaryIngredientArr];

  // Select menu items
  for (let i = 0; i < DAYS; i++) {
    let diversifyingPrimaryIngredients = true;
    let selection;
    let recipe;
    while (diversifyingPrimaryIngredients) {
      selection = Math.floor(Math.random() * recipes.length);
      recipe = recipes[selection];
      if (isValidPrimaryIngredient(
        recipe.primaryIngredient, validPrimaries)) {
        diversifyingPrimaryIngredients = false;
        const toRemove = validPrimaries.map(e => e.name)
          .indexOf(recipe.primaryIngredient.name);
        validPrimaries.splice(toRemove, 1);
        if (validPrimaries.length === 0) {
          validPrimaries = [...primaryIngredientArr];
        }
        // console.log(`Selected a recipe! \n${recipe}`)
      }
    }
    recipes.splice(selection, 1);
    menu.push(recipe);
  }

  // Display Menu to the user
  let output = "";
  for (let i = 0; i < menu.length; i++) {
    const menuItem = menu[i]
    output += `\nDay ${i}:\n - ${menuItem.name}\n  -- Primary Ingredient: ${menuItem.primaryIngredient.name}`;
  }
  console.log(output)
}

// Call main function
main();