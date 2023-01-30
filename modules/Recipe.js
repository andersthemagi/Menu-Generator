class IngredientType {
  static Cheese = new IngredientType("Cheese");
  static Dairy = new IngredientType("Dairy");
  static Eggs = new IngredientType("Eggs");
  static Fats = new IngredientType("Fats and Oils");
  static Fruit = new IngredientType("Fruit");
  static Grain = new IngredientType("Grain");
  static Herb = new IngredientType("Herbs and Spices");
  static Meat = new IngredientType("Meat");
  static Milk = new IngredientType("Milk");
  static Oils = this.Fats;
  static Nuts = new IngredientType("Nuts");
  static Seafood = new IngredientType("Seafood");
  static Spice = this.Herb;
  static Vegetable = new IngredientType("Vegetable");
  static Other = new IngredientType("Other")

  constructor(inName) {
    this.name = inName;
  }
}

class Ingredient {
  #_name;
  #_ingredientType;

  constructor(inName, ingredientType = IngredientType.Other) {
    this.#_name = inName;
    this.#_ingredientType = ingredientType;
  }

  get name() {
    return this.#_name;
  }

  set name(newName) {
    this.#_name = newName;
  }
};

class Recipe {
  #_name;
  #_primaryIngredient;

  constructor(inName = "Not Set",
    inPrimaryIngredient) {
    if (!this.#checkValidName(inName)) {
      this.#throwNameError();
    }
    if (!this.#checkValidPrimaryIngredient(inPrimaryIngredient)) {
      this.#throwPrimaryIngredientError();
    }
    this.#_name = inName;
    this.#_primaryIngredient = inPrimaryIngredient;
  }

  /* Public Functions */

  /* - Getters and Setters */

  get name() {
    return this.#_name;
  }

  set name(newName) {
    if (!this.#checkValidName(newName)) {
      this.#throwNameError();
    }
    this.#_name = newName;
  }

  get primaryIngredient() {
    return this.#_primaryIngredient;
  }

  set primaryIngredient(newPrimaryIngredient) {
    if (!this.#checkValidPrimaryIngredient(newPrimaryIngredient)) {
      this.#throwPrimaryIngredientError();
    }
    this.#_primaryIngredient = newPrimaryIngredient;
  }

  /* - Utilities */

  toString() {
    return `Name: ${this.#_name},\nPrimary Ingredient: ${this.#_primaryIngredient.name}`;
  }

  /* Private Functions */

  #checkValidName(name) {
    return typeof name === "string";
  }

  #checkValidPrimaryIngredient(newPrimaryIngredient) {
    return Ingredient.prototype.isPrototypeOf(newPrimaryIngredient);
  }

  #throwNameError() {
    throw new Error("Recipe.Name must be a string.");
  }

  #throwPrimaryIngredientError() {
    throw new Error("Recipe.PrimaryIngredient must be of class Ingredient");
  }
};

module.exports = { IngredientType, Ingredient, Recipe };