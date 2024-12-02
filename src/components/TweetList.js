import React from 'react';
import Tweet from './Tweet';

const TweetList = ({ tweets }) => {
  return (
    <div>
      {tweets.map((tweet, index) => (
        <Tweet key={index} tweet={tweet.account} />
      ))}
    </div>
  );
};

export default TweetList;
