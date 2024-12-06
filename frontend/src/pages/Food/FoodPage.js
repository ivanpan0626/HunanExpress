import React, { useEffect, useState } from "react";
import styles from "./foodPage.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { getById } from "../../services/foodService";
import { useCart } from "../../hooks/useCart";
import Tags from "../../components/Tags/Tags";
import Price from "../../components/Price/Price";
import NotFound from "../../components/NotFound/NotFound";

export default function FoodPage() {
  const [food, setFood] = useState({});
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart(food, Number(quantity));
    navigate("/");
  };

  const handleGoBack = () => {
    navigate("/");
  };

  useEffect(() => {
    // Fetch food item and update state
    getById(id).then((fetchedFood) => {
      // Set the default item size if available
      if (fetchedFood.size) {
        fetchedFood.selectedOptions = fetchedFood.size[0];
        fetchedFood.name = fetchedFood.ogName + ` - (${fetchedFood.size[0]})`;
      }
      if (fetchedFood.addons) {
        fetchedFood.selectedOptions = fetchedFood.addons[0];
        fetchedFood.name = fetchedFood.ogName + ` - (${fetchedFood.addons[0]})`;
      }
      setFood(fetchedFood);
    });
  }, [id]);

  const updateFoodWithOptions = (selected, type) => {
    const selectedIndex =
      type === "size"
        ? food.size.indexOf(selected)
        : food.addons.indexOf(selected);
    // Update food state with the new selectedOptions and corresponding price
    setFood((prevFood) => ({
      ...prevFood, // Spread the previous food object to keep other properties
      selectedOptions: selected, // Update selected size
      price: prevFood.priceOptions[selectedIndex], // Update price based on selected size
      name: prevFood.ogName + ` - (${selected})`,
    }));
  };

  return (
    //Food page for each individual item
    <>
      {!food ? (
        <NotFound
          message="Food not Found!"
          linkedText="Back to Home Page"
        ></NotFound>
      ) : (
        <div className={styles.container}>
          <img
            className={styles.image}
            src={`${food.imageUrl}`}
            alt={food.name}
          ></img>
          <div className={styles.details}>
            <div className={styles.header}>
              <span className={styles.name}>{food.name}</span>
            </div>
            <div className={styles.tags}>
              {food.tags && (
                <Tags
                  tags={food.tags.map((tag) => ({ name: tag }))}
                  forFoodPage={true}
                ></Tags>
              )}
            </div>
            <div className={styles.body}>
              {/* Size section */}
              {food.size && (
                <div className={styles.sizesContainer}>
                  <span className={styles.sizeTitle}>Choose a Size:</span>
                  <div className={styles.sizes}>
                    {food.size.map((size, index) => (
                      <div key={index} className={styles.sizeOption}>
                        <input
                          type="radio"
                          id={`size-${index}`}
                          name="size"
                          value={size}
                          checked={food.selectedOptions === size}
                          onChange={(e) =>
                            updateFoodWithOptions(e.target.value, "size")
                          }
                        />
                        <label
                          htmlFor={`size-${index}`}
                          className={styles.sizeLabel}
                        >
                          {size}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Addons section */}
              {food.addons && (
                <div className={styles.addonsContainer}>
                  <span className={styles.addonTitle}>Choose an Addon:</span>
                  <div className={styles.addons}>
                    {food.addons.map((addon, index) => (
                      <div key={index} className={styles.addonOption}>
                        <input
                          type="radio"
                          id={`addon-${index}`}
                          name="addon"
                          value={addon}
                          checked={food.selectedOptions === addon} // Ensure the radio button is checked based on the selected addon
                          onChange={(e) =>
                            updateFoodWithOptions(e.target.value, "addon")
                          }
                        />
                        <label
                          htmlFor={`addon-${index}`}
                          className={styles.addonLabel}
                        >
                          {addon}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Special instructions section */}
              <div className={styles.instructions}>
                <label
                  htmlFor="special-instructions"
                  className={styles.instructionsLabel}
                >
                  Special Instructions:
                </label>
                <textarea
                  id="special-instructions"
                  className={styles.instructionsInput}
                  placeholder="Add any specific requests for this item"
                  onChange={(e) =>
                    setFood((prevFood) => ({
                      ...prevFood,
                      instructions: e.target.value, // Update instructions in state
                    }))
                  }
                ></textarea>
              </div>
            </div>

            {/* Footer Section */}
            <div className={styles.priceQuantityContainer}>
              <div className={styles.price}>
                <Price price={food.price}></Price>
              </div>
              <div>
                <label style={{ color: "darkgrey" }}>Quantity: </label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                  <option>9</option>
                  <option>10</option>
                </select>
              </div>
            </div>
            <div className={styles.buttonContainer}>
              <button onClick={handleAddToCart}>Add to Cart</button>
              <button onClick={handleGoBack}>Back to Home</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
