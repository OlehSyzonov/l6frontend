import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
import idl from '../idl.json';

const network = 'https://api.devnet.solana.com';
const opts = { preflightCommitment: 'processed' };
const programID = new PublicKey(process.env.REACT_APP_TWITTER_PROGRAM_ID);

const getProvider = () => {
  const connection = new Connection(network, opts.preflightCommitment);
  const provider = new AnchorProvider(connection, window.solana, opts);
  return provider;
};

const getProgram = () => {
  const provider = getProvider();
  const program = new Program(idl, programID, provider);
  return program;
};

export { getProvider, getProgram };
