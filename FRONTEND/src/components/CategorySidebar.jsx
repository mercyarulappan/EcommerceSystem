import axios from "axios";
import { useEffect, useState } from "react";

const CategorySidebar = ({ onSelectCategory, selectedCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  return (
    <div className="category-sidebar">
      <h3>Categories</h3>

      <div
        className={`category-item ${!selectedCategory ? "category-active" : ""}`}
        onClick={() => onSelectCategory(null)}
      >
        All
      </div>
      
      {categories.map((cat) => (
        <div
          key={cat.id}
          className={`category-item ${
            selectedCategory === cat.id ? "category-active" : ""
          }`}
          onClick={() => onSelectCategory(cat.id)}
        >
          {cat.name}
        </div>
      ))}
    </div>
  );
};

export default CategorySidebar;
