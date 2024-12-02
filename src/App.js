import React, { useState, useEffect } from 'react';
import { web3 } from '@coral-xyz/anchor';
import { getProvider, getProgram } from './utils/solana';
import TweetList from './components/TweetList';
import { getTweetAddress } from './utils/helpers';

const App = () => {
  const [tweets, setTweets] = useState([]);
  const [tweetContent, setTweetContent] = useState('');
  const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    const loadTweets = async () => {
      const program = getProgram();
      const tweetAccounts = await program.account.tweet.all();
      setTweets(tweetAccounts);
    };
    loadTweets();
  }, []);

  const connectWallet = async () => {
    const provider = getProvider();
    if (provider.wallet) {
      setWalletAddress(provider.wallet.publicKey.toString());
    }
  };

  const sendTweet = async () => {
    const program = getProgram();
    const provider = getProvider();
    const [tweetAccount] = getTweetAddress(tweetContent, provider.wallet.publicKey, program.programId);

    await program.rpc.initialize(tweetContent, {
      accounts: {
        tweet: tweetAccount,
        user: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId
      }
    });

    setTweetContent('');
    const tweetAccounts = await program.account.tweet.all();
    setTweets(tweetAccounts);
  };

  return (
    <div>
      <h1>Twitter on Solana</h1>
      {!walletAddress ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <input
            value={tweetContent}
            onChange={(e) => setTweetContent(e.target.value)}
            placeholder="What's happening?"
          />
          <button onClick={sendTweet}>Tweet</button>
          <TweetList tweets={tweets} />
        </div>
      )}
    </div>
  );
};

export default App;
