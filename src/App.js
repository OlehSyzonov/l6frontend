import React, { useState, useEffect } from 'react';
import './App.css';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
import idl from './idl.json';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const programID = new PublicKey('Je3bmRaREtmhnbE6PJ3KP5aZZm15aeUwqQHSyXGwRPd');
const network = clusterApiUrl('devnet');
const opts = {
  preflightCommitment: 'processed'
};

const TWEET_SEED = "TWEET_SEED";

function App() {
  const [program, setProgram] = useState(null);
  const [provider, setProvider] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    initializeProgram();
  }, []);

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(connection, window.solana, opts);
    setProvider(provider);
    return provider;
  };

  const initializeProgram = async () => {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    setProgram(program);
    loadTweets(program);
  };

  const loadTweets = async (program) => {
    const tweetAccounts = await program.account.tweet.all();
    setTweets(tweetAccounts);
  };

  const createTweet = async () => {
    if (!provider) {
      throw new WalletNotConnectedError();
    }
    const [tweetPDA, bump] = await PublicKey.findProgramAddress(
      [
        Buffer.from(topic),
        Buffer.from(TWEET_SEED),
        provider.wallet.publicKey.toBuffer()
      ],
      programID
    );

    await program.methods.initialize(topic, content).accounts({
      tweetAuthority: provider.wallet.publicKey,
      tweet: tweetPDA,
      systemProgram: web3.SystemProgram.programId
    }).rpc();

    loadTweets(program);
  };

  return (
    <div className="App">
      <WalletMultiButton />
      <h1>Twitter dApp on Solana</h1>
      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Tweet topic"
      />
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Tweet content"
      />
      <button onClick={createTweet}>Create Tweet</button>
      <div>
        {tweets.map((tweet, index) => (
          <div key={index}>
            <p>Topic: {tweet.account.topic.toString()}</p>
            <p>Content: {tweet.account.content.toString()}</p>
            <small>by {tweet.account.tweet_author.toString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
