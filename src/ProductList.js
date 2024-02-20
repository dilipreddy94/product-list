// ProductList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Skeleton, Pagination } from '@mui/material';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setLoading(true);
    fetchProducts();
  }, [page]);

  const fetchProducts = () => {
    fetch(`https://mobile-tha-server-8ba57.firebaseapp.com/walmartproducts/${page}/${itemsPerPage}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.error('API response is not an array:', data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <Grid container spacing={3}>
        {loading ? (
          // Show Skeleton view while loading
          Array.from({ length: itemsPerPage }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <Skeleton variant="rect" height={200} />
                <CardContent>
                  <Typography gutterBottom variant="h5">
                    <Skeleton />
                  </Typography>
                  <Typography variant="body2">
                    <Skeleton />
                  </Typography>
                  <Typography variant="body2">
                    <Skeleton />
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          // Render product cards when data is loaded
          products.map(product => (
            <Grid item xs={12} sm={6} md={4} key={product.productId}>
              <Card>
                <Link to={`/products/${product.productId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {product.productName}
                    </Typography>
                    <img
                      src={product.productImage ? `https://mobile-tha-server-8ba57.firebaseapp.com/${product.productImage}` : 'https://mobile-tha-server-8ba57.firebaseapp.com/walmartproducts/1/8'}
                      alt={product.productName}
                      style={{ width: '100%', height: 'auto' }}
                    />
                    <Typography variant="body2" color="textSecondary" component="p">
                      Category: {product.categoryPath}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      Price: {product.price}
                    </Typography>
                    {/* Include other relevant product fields */}
                  </CardContent>
                </Link>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
      <Pagination
        count={Math.ceil(products.length / itemsPerPage)}
        page={page}
        onChange={handleChangePage}
        color="primary"
        style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
      />
    </div>
  );
}

export default ProductList;
