import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toastError, toastSuccess } from '../helper/toastMessage';
import { voteWithdrawRequest, withdrawAmount } from '../redux/interactions';

const colorMaker = (state) => {
  if (state === 'Pending') return 'bg-blue-600';
  return 'bg-cyan-500';
};

const WithdrawRequestCard = ({ props, withdrawReq, setWithdrawReq, contractAddress }) => {
  const dispatch = useDispatch();
  const [btnLoader, setBtnLoader] = useState(false);

  const account = useSelector(state => state.web3Reducer.account);
  const web3 = useSelector(state => state.web3Reducer.connection);

  const withdrawBalance = (reqId) => {
    setBtnLoader(reqId);
    const data = {
      contractAddress,
      reqId,
      account,
      amount: props.amount
    };

    const onSuccess = () => {
      setBtnLoader(false);
      const filteredReq = withdrawReq.find(req => req.requestId === props.requestId);
      filteredReq.status = 'Completed';
      setWithdrawReq([...withdrawReq.filter(req => req.requestId !== props.requestId), filteredReq]);
      toastSuccess(`Withdrawal successful for request id ${reqId}`);
    };

    const onError = (message) => {
      setBtnLoader(false);
      toastError(message);
    };

    withdrawAmount(web3, dispatch, data, onSuccess, onError);
  };

  const vote = (reqId) => {
    setBtnLoader(reqId);
    const data = {
      contractAddress,
      reqId,
      account
    };

    const onSuccess = () => {
      setBtnLoader(false);
      const filteredReq = withdrawReq.find(req => req.requestId === props.requestId);
      filteredReq.totalVote = Number(filteredReq.totalVote) + 1;
      setWithdrawReq([...withdrawReq.filter(req => req.requestId !== props.requestId), filteredReq]);
      toastSuccess(`Vote successfully added for request id ${reqId}`);
    };

    const onError = (message) => {
      setBtnLoader(false);
      toastError(message);
    };

    voteWithdrawRequest(web3, data, onSuccess, onError);
  };

  return (
    <div className="relative w-full max-w-2xl bg-white/70 backdrop-blur-md border border-gray-300 rounded-2xl shadow p-6 my-4">
      <div
        className={`absolute top-4 right-4 px-3 py-1 text-xs font-bold text-white rounded-full ${colorMaker(props.status)}`}
      >
        {props.status}
      </div>

      <h1 className="text-xl font-semibold text-gray-900 mb-4">{props.desc}</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/5">
          <p className="text-sm font-semibold text-gray-800">Requested Amount</p>
          <p className="text-sm text-gray-600 mb-3">{props.amount} ETH</p>

          <p className="text-sm font-semibold text-gray-800">Total Vote</p>
          <p className="text-sm text-gray-600">{props.totalVote}</p>
        </div>

        <div className="w-full lg:w-3/5">
          <p className="text-sm font-semibold text-gray-800">Recipient Address</p>
          <p className="text-sm text-gray-600 truncate mb-3">{props.reciptant}</p>

          {account === props.reciptant ? (
            <button
              onClick={() => withdrawBalance(props.requestId)}
              disabled={props.status === "Completed" || btnLoader === props.requestId}
              className={`w-full sm:w-auto px-5 py-2 rounded-md text-white text-sm font-medium transition ${
                props.status === "Completed" ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {btnLoader === props.requestId ? 'Loading...' : 'Withdraw'}
            </button>
          ) : (
            <button
              onClick={() => vote(props.requestId)}
              disabled={btnLoader === props.requestId}
              className="w-full sm:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition"
            >
              {btnLoader === props.requestId ? 'Loading...' : 'Vote'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WithdrawRequestCard;
