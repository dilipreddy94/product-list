// ProductDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, CircularProgress, Button } from '@mui/material';

function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate(); // Hook to access navigation
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`https://mobile-tha-server-8ba57.firebaseapp.com/walmartproducts/1/10?minPrice=500&maxPrice=2000&inStock=true&minReviewCount=2${productId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        const data = await response.json();
        const foundProduct = data.products.find(prod => prod.productId === productId);
        if (!foundProduct) {
          throw new Error('Product not found');
        }
        setProduct(foundProduct);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!product) {
    return (
      <div>
        <Typography variant="h6">Product not found</Typography>
        <Button variant="contained" color="primary" onClick={handleGoBack}>Go Back to Product List</Button>
      </div>
    );
  }

  return (
    <div>
      <Typography variant="h4">{product.productName}</Typography>
      <Typography variant="body1">Category: {product.categoryPath}</Typography>
      <Typography variant="body1">Price: {product.price}</Typography>
      <Typography variant="body1">In Stock: {product.inStock ? 'Yes' : 'No'}</Typography>
      <Typography variant="body1">Rating: {product.reviewRating}</Typography>
      {/* Include other fields and their values as needed */}
      <Button variant="contained" color="primary" onClick={handleGoBack}>Go Back to Product List</Button>
    </div>
  );
}

export default ProductDetails;
