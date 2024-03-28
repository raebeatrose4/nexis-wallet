import { API, URLS, resultMiddleware, errorMiddleware } from '~/constants/api';

export const getTransactions = (
  address: string,
  offset: number,
  count: number
) => {
  // return API.get(URLS.GET_ACCOUNT, { params: { address, offset, count } })
  //   .then(resultMiddleware)
  //   .catch(errorMiddleware);
  return "";
};

export const getFTMPrice = () => {
  API.get(
    'https://price.fantom.network/api/get-price'
  )
    .then(resultMiddleware)
    .catch(errorMiddleware);
};
