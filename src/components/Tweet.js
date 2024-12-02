import React from 'react';

const Tweet = ({ tweet }) => {
  return (
    <div>
      <p>{tweet.content}</p>
      <small>by {tweet.author.toString()}</small>
    </div>
  );
};

export default Tweet;
