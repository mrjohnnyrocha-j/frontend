// src/components/ReviewForm.js

import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Rating,
  Box,
} from '@mui/material';

/**
 * ReviewForm Component
 * @description Provides a form for users to submit a review.
 * @param {Function} onSubmit - Function to handle the submission of the review.
 */
const ReviewForm = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  /**
   * Handles the submission of a new review.
   */
  const handleSubmit = () => {
    if (rating === 0 || comment.trim() === '') {
      alert('Please provide a rating and a comment.');
      return;
    }
    onSubmit({ rating, comment });
    setRating(0);
    setComment('');
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1">Submit a Review</Typography>
      <Rating
        name="review-rating"
        value={rating}
        onChange={(event, newValue) => {
          setRating(newValue);
        }}
      />
      <TextField
        label="Comment"
        multiline
        rows={3}
        fullWidth
        variant="outlined"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        sx={{ mt: 1 }}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 1 }}>
        Submit
      </Button>
    </Box>
  );
};

export default ReviewForm;
