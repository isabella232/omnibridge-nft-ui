import { utils } from 'ethers';

import {
  getExplorerUrl,
  getNetworkCurrency,
  getNetworkName,
  getRPCUrl,
} from './helpers';

export const addChainToMetaMask = async ethereumChain => {
  const { chainId } = ethereumChain;
  const { name, symbol } = getNetworkCurrency(chainId);
  return window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: utils.hexValue(chainId),
        chainName: getNetworkName(chainId),
        nativeCurrency: {
          name,
          symbol,
          decimals: 18,
        },
        rpcUrls: [getRPCUrl(chainId)],
        blockExplorerUrls: [getExplorerUrl(chainId)],
      },
    ],
  });
};
