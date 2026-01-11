import React, { useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { contribute, createWithdrawRequest } from '../redux/interactions';
import { etherToWei } from '../helper/helper';
import { toastSuccess, toastError } from '../helper/toastMessage';

const colorMaker = (state) => {
  if (state === 'Fundraising') return 'bg-cyan-600';
  if (state === 'Expired') return 'bg-red-600';
  return 'bg-emerald-600';
};

const FundRiserCard = ({ props, pushWithdrawRequests, triggerRefresh }) => {
  const [btnLoader, setBtnLoader] = useState(false);
  const [amount, setAmount] = useState('');
  const dispatch = useDispatch();
  const crowdFundingContract = useSelector((state) => state.fundingReducer.contract);
  const account = useSelector((state) => state.web3Reducer.account);
  const web3 = useSelector((state) => state.web3Reducer.connection);

  const contributeAmount = (projectId, minContribution) => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount < minContribution) {
      toastError(`Minimum contribution amount is ${minContribution} ETH`);
      return;
    }

    setBtnLoader(projectId);
    const contributionAmount = etherToWei(numericAmount);

    const data = {
      contractAddress: projectId,
      amount: contributionAmount,
      account: account,
    };

    const onSuccess = () => {
      setBtnLoader(false);
      setAmount('');
      toastSuccess(`Successfully contributed ${numericAmount} ETH`);
      if (triggerRefresh) triggerRefresh();
    };

    const onError = (message) => {
      setBtnLoader(false);
      toastError(message);
    };

    contribute(crowdFundingContract, data, dispatch, onSuccess, onError);
  };

  const requestForWithdraw = (projectId) => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toastError(`Please enter a valid withdraw amount`);
      return;
    }

    setBtnLoader(projectId);
    const contributionAmount = etherToWei(numericAmount);

    const data = {
      description: `${numericAmount} ETH requested for withdraw`,
      amount: contributionAmount,
      recipient: account,
      account: account,
    };

    const onSuccess = (data) => {
      setBtnLoader(false);
      setAmount('');
      if (pushWithdrawRequests) pushWithdrawRequests(data);
      if (triggerRefresh) triggerRefresh();
      toastSuccess(`Successfully requested withdraw of ${numericAmount} ETH`);
    };

    const onError = (message) => {
      setBtnLoader(false);
      toastError(message);
    };

    createWithdrawRequest(web3, projectId, data, onSuccess, onError);
  };

  return (
    <div className="relative w-full max-w-md p-6 bg-white/70 backdrop-blur-md border border-gray-300 rounded-2xl shadow hover:shadow-xl transition-all">
      <div
        className={`absolute top-4 right-4 text-white text-xs font-bold px-3 py-1 rounded-full ${colorMaker(props.state)}`}
      >
        {props.state}
      </div>

      <Link href={`/project-details/${props.address}`}>
        <h1 className="text-2xl font-bold text-gray-900 hover:text-sky-500 cursor-pointer">
          {props.title}
        </h1>
      </Link>

      <p className="text-sm text-gray-700 mb-4">{props.description}</p>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/3 p-4 bg-white rounded-xl shadow-inner">
          <p className="font-semibold text-gray-800 flex items-center gap-1">
            🎯 Target
          </p>
          <p className="text-sm text-gray-600 mb-2">{props.goalAmount} ETH</p>
          <p className="font-semibold text-gray-800 flex items-center gap-1">
            📅 Deadline
          </p>
          <p className="text-sm text-gray-600">{props.deadline}</p>
        </div>

        <div className="w-full sm:w-2/3 p-4 bg-white rounded-xl shadow-inner">
          {props.state !== 'Successful' ? (
            <>
              <p className="font-semibold text-gray-800 flex items-center gap-1">💰 Contribution Amount:</p>
              <div className="flex">
                <input
                  type="number"
                  step="any"
                  placeholder="Enter ETH"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={btnLoader === props.address}
                  className="w-full rounded-l-md border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button
                  className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-r-md text-sm"
                  onClick={() => contributeAmount(props.address, props.minContribution)}
                  disabled={btnLoader === props.address}
                >
                  {btnLoader === props.address ? 'Loading...' : 'Contribute'}
                </button>
              </div>
              <p className="text-sm text-red-600 mt-1">
                <strong>NOTE:</strong> Minimum is {props.minContribution} ETH
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold text-gray-800 flex items-center gap-1">👜 Contract Balance</p>
              <p className="text-sm text-gray-600 mb-2">{props.contractBalance} ETH</p>
              {props.creator === account && (
                <>
                  <p className="font-semibold text-gray-800">Request Withdrawal:</p>
                  <div className="flex">
                    <input
                      type="number"
                      step="any"
                      placeholder="Enter ETH"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      disabled={btnLoader === props.address}
                      className="w-full rounded-l-md border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <button
                      className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-r-md text-sm"
                      onClick={() => requestForWithdraw(props.address)}
                      disabled={btnLoader === props.address}
                    >
                      {btnLoader === props.address ? 'Loading...' : 'Withdraw'}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-700 mt-4 break-words">
        Creator: <span className="font-mono">{props.creator}</span>
      </p>

      {props.state !== 'Successful' && (
        <div className="w-full bg-gray-200 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-sky-500 text-white text-xs text-center py-1"
            style={{ width: `${Math.min(props.progress, 100)}%` }}
          >
            {props.progress}%
          </div>
        </div>
      )}
    </div>
  );
};

export default FundRiserCard;
