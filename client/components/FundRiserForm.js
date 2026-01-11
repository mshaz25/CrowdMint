import React, { useState } from 'react';
import moment from 'moment';
import { startFundRaising } from '../redux/interactions';
import { useDispatch, useSelector } from 'react-redux';
import { etherToWei } from '../helper/helper';
import { toastSuccess, toastError } from '../helper/toastMessage';
import { useRouter } from 'next/router';

const FundRiserForm = () => {
  const crowdFundingContract = useSelector(state => state.fundingReducer.contract);
  const account = useSelector(state => state.web3Reducer.account);
  const web3 = useSelector(state => state.web3Reducer.connection);

  const dispatch = useDispatch();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetedContributionAmount, setTargetedContributionAmount] = useState('');
  const [minimumContributionAmount, setMinimumContributionAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [btnLoading, setBtnLoading] = useState(false);

  const riseFund = (e) => {
    e.preventDefault();
    setBtnLoading(true);
    const unixDate = moment(deadline).valueOf();

    const onSuccess = () => {
      setBtnLoading(false);
      setTitle('');
      setDescription('');
      setTargetedContributionAmount('');
      setMinimumContributionAmount('');
      setDeadline('');
      toastSuccess('Fundraising started 🎉');
      toastSuccess('Redirecting to Dashboard...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 5000);
    };

    const onError = (error) => {
      setBtnLoading(false);
      toastError(error);
    };

    const data = {
      minimumContribution: etherToWei(minimumContributionAmount),
      deadline: Number(unixDate),
      targetContribution: etherToWei(targetedContributionAmount),
      projectTitle: title,
      projectDesc: description,
      account: account,
    };

    startFundRaising(web3, crowdFundingContract, data, onSuccess, onError, dispatch);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Start Your Fundraising For Free
      </h1>

      <form onSubmit={riseFund} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Title:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-300 outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Project title"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Description:</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-300 outline-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Short project description"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Targeted Contribution Amount (ETH):</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-300 outline-none"
            value={targetedContributionAmount}
            onChange={(e) => setTargetedContributionAmount(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Minimum Contribution Amount (ETH):</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-300 outline-none"
            value={minimumContributionAmount}
            onChange={(e) => setMinimumContributionAmount(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Deadline:</label>
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-300 outline-none"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-[#F56D91] text-white rounded-md hover:bg-[#d15677] transition"
          disabled={btnLoading}
        >
          {btnLoading ? 'Loading...' : 'Raise Fund'}
        </button>
      </form>
    </div>
  );
};

export default FundRiserForm;
