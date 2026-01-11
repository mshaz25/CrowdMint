import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { connectWithWallet } from '../helper/helper';
import { loadAccount } from '../redux/interactions';

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const web3 = useSelector((state) => state.web3Reducer.connection);

  const connect = () => {
    const onSuccess = () => {
      loadAccount(web3, dispatch);
      router.push('/dashboard');
    };
    connectWithWallet(onSuccess);
  };

  useEffect(() => {
    (async () => {
      if (web3) {
        const account = await loadAccount(web3, dispatch);
        if (account.length > 0) {
          router.push('/dashboard');
        }
      }
    })();
  }, [web3]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1D174D] px-4">
      <div className="bg-white rounded-2xl flex flex-col md:flex-row items-center justify-between p-6 md:p-10 max-w-6xl w-full">
        
        {/* Left - Video */}
        <div className="md:w-1/2 w-full flex justify-center items-center">
          <video
            src="/intro.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="rounded-xl w-full max-w-[400px] md:max-h-[260px] object-cover"
          />
        </div>

        {/* Right - Content */}
        <div className="md:w-1/2 w-full text-center md:text-left mt-6 md:mt-0 px-2 md:px-6">
          <h1 className="text-3xl font-bold text-[#1D174D] mb-4">
            Welcome to <span className="text-[#8D8DAA]">CrowdMint</span>
          </h1>
          <p className="text-gray-600 mb-6">
            A decentralized platform where anyone can contribute to impactful causes and help bring ideas to life.
          </p>
          <button
            className="bg-[#00B4D8] hover:bg-[#0096c7] text-white font-bold py-3 px-6 rounded-md transition duration-300"
            onClick={connect}
          >
            Connect to MetaMask
          </button>
        </div>
      </div>
    </div>
  );
}
