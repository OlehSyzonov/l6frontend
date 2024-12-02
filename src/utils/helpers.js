import { PublicKey } from '@solana/web3.js';
import crypto from 'crypto';

export const getTweetAddress = (topic, author, programID) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from(topic),
      Buffer.from('TWEET_SEED'),
      author.toBuffer()
    ],
    programID
  );
};

export const getReactionAddress = (author, tweet, programID) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('TWEET_REACTION_SEED'),
      author.toBuffer(),
      tweet.toBuffer()
    ],
    programID
  );
};

export const getCommentAddress = (commentContent, author, parentTweet, programID) => {
  const hexString = crypto.createHash('sha256').update(commentContent, 'utf-8').digest('hex');
  const contentSeed = Uint8Array.from(Buffer.from(hexString, 'hex'));

  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('COMMENT_SEED'),
      author.toBuffer(),
      contentSeed,
      parentTweet.toBuffer()
    ],
    programID
  );
};
