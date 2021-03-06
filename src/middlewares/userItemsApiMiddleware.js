import axios from 'axios';
import {
  GET_USER_ITEMS_FROM_API,
  showUserItems,
  SEND_ITEM_TO_API,
  CHANGE_USER_ITEM_STATUS,
  saveItemAdded,
  showReco,
  GET_RECO,
  DELETE_ITEM_FROM_USERLIST,
  removeDeletedItem,
} from '../actions/userItems';
import { loaderOff } from '../actions/loader';

const apiMiddleware = (store) => (next) => (action) => {
  // to add an item we need current user connected id
  // so we need to compare the user list store in state to the current username store in state
  const userList = store.getState().user.list;
  const userConnectedUsername = store.getState().login.nickname;
  const currentUserDatas = userList.find((user) => user.username === userConnectedUsername);

  switch (action.type) {
    case GET_USER_ITEMS_FROM_API:
      axios.get(
        'http://orianeberti-server.eddi.cloud/projet-13-ultimatelist-back/public/api/list_items',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('user_token')}`,
          },
        },
      )
        .then((response) => {
          // console.log('Api response list_items:', response.data.item);

          const actionToDispatch = showUserItems(response.data);
          store.dispatch(actionToDispatch);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          store.dispatch(loaderOff());
        });
      break;

    case SEND_ITEM_TO_API:
      axios.post(
        'http://orianeberti-server.eddi.cloud/projet-13-ultimatelist-back/public/api/list_items/create',
        {
          // Data we have to send to the API
          item: {
            id: action.item,
          },
          user: {
            id: currentUserDatas.id,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('user_token')}`,
          },
        },
      )
        .then((response) => {
          store.dispatch(saveItemAdded(response.data));
        })
        .catch((error) => {
          console.log(error);
        });
      break;

    case CHANGE_USER_ITEM_STATUS:
      axios.patch(
        `http://orianeberti-server.eddi.cloud/projet-13-ultimatelist-back/public/api/list_items/${action.item}`,
        {
          item_status: action.item_status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('user_token')}`,
          },
        },
      )
        .catch((error) => {
          console.log(error);
        });
      break;

    case GET_RECO:
      axios.get(
        `http://orianeberti-server.eddi.cloud/projet-13-ultimatelist-back/public/api/items/recommandations/${userConnectedUsername}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('user_token')}`,
          },
        },
      )
        .then((response) => {
          const actionToDispatch = showReco(response.data);
          store.dispatch(actionToDispatch);
          // console.log('Reco:', response.data.id);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          store.dispatch(loaderOff());
        });
      break;

    case DELETE_ITEM_FROM_USERLIST:
      axios.delete(
        `http://orianeberti-server.eddi.cloud/projet-13-ultimatelist-back/public/api/list_items/${action.itemId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('user_token')}`,
          },
        },
      )
        .then(() => {
          const actionToDispatch = removeDeletedItem(action.itemId);
          store.dispatch(actionToDispatch);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          store.dispatch(loaderOff());
        });
      break;

    default:
  }
  next(action);
};
export default apiMiddleware;
