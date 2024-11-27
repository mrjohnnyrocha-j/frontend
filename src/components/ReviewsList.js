// src/components/ReviewsList.js

import React from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
} from '@mui/material';
import Rating from '@mui/material/Rating';

/**
 * ReviewsList Component
 * @description Displays a list of user reviews for an app.
 * @param {Object[]} reviews - Array of review objects.
 */
const ReviewsList = ({ reviews }) => {
  if (reviews.length === 0) {
    return <Typography variant="body2">No reviews yet.</Typography>;
  }

  return (
    <List>
      {reviews.map((review, index) => (
        <React.Fragment key={index}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar>{review.user.charAt(0).toUpperCase()}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <>
                  <Typography variant="subtitle1">{review.user}</Typography>
                  <Rating value={review.rating} readOnly size="small" />
                </>
              }
              secondary={
                <>
                  <Typography variant="body2" color="text.primary">
                    {review.comment}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {review.date}
                  </Typography>
                </>
              }
            />
          </ListItem>
          {index < reviews.length - 1 && <Divider component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default ReviewsList;
