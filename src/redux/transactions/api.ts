import { API, URLS, resultMiddleware, errorMiddleware } from '~/constants/api';

export const getTransactions = (
  address: string,
  offset: number,
  count: number
) => {
  return API.get(`https://evm-testnet.nexscan.io/api/v2/addresses/${address}`)
    .then(resultMiddleware)
    .catch(errorMiddleware);
  return "";
};

export const getFTMPrice = () => {
  API.get(
    'https://price.fantom.network/api/get-price'
  )
    .then(resultMiddleware)
    .catch(errorMiddleware);
};
