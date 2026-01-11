import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader';
import authWrapper from '../helper/authWrapper';
import { getMyContributionList } from '../redux/interactions';
import Link from 'next/link';

const MyContributions = () => {
  const crowdFundingContract = useSelector((state) => state.fundingReducer.contract);
  const account = useSelector((state) => state.web3Reducer.account);

  const [contributions, setContributions] = useState(null);

  useEffect(() => {
    (async () => {
      if (crowdFundingContract) {
        const res = await getMyContributionList(crowdFundingContract, account);
        setContributions(res);
      }
    })();
  }, [crowdFundingContract]);

  return (
    <div className="px-4 py-6 lg:px-12 flex flex-wrap gap-6 justify-center">
      {contributions ? (
        contributions.length > 0 ? (
          contributions.map((data, i) => (
            <div
              key={i}
              className="inline-block min-w-[250px] max-w-full bg-white/70 backdrop-blur-md border border-gray-300 shadow rounded-2xl p-4"
              style={{ width: `${data.projectAddress.length * 9 + 120}px` }} // Adjust width based on address length
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-md bg-slate-300" />
                <div className="flex-grow">
                  <Link href={`/project-details/${data.projectAddress}`}>
                    <p
                      className="text-sm font-semibold text-gray-800 break-all cursor-pointer"
                      title={data.projectAddress}
                    >
                      {data.projectAddress}
                    </p>
                  </Link>
                  <p className="text-sm text-gray-600 font-medium">{data.amount} ETH</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-700 font-medium">You haven't contributed to any project yet!</p>
        )
      ) : (
        <div className="w-full">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default authWrapper(MyContributions);
