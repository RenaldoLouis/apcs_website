import http from '../services/http';

const handleErrors = (err /* path  payload */) => {
  const errorMessageKey = err.response?.data?.error.Message
  return { error: errorMessageKey }
}

const getRequest = async (path, payload) => {
  try {
    console.log("path", path)
    const res = await http.get(path, payload)
    return res;
  } catch (err) {
    return handleErrors(err)
  }
}

const postRequest = async (path, payload) => {
  try {
    const res = await http.post(path, payload)
    return res
  } catch (err) {
    return handleErrors(err)
  }
}

const putRequest = async (path, payload) => {
  try {
    const res = await http.put(path, payload)
    return res
  } catch (err) {
    return handleErrors(err)
  }
}

const patchRequest = async (path, payload) => {
  try {
    return await http.patch(path, payload)
  } catch (err) {
    return handleErrors(err)
  }
}

const deleteRequest = async (path) => {
  try {
    return await http.delete(path)
  } catch (err) {
    return handleErrors(err)
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  auth: {
    login: (payload) => postRequest('/users/login', payload),
    signup: (payload) => postRequest('/users/signUp', payload),
    verify: (payload) => getRequest(`/users/emailVerification?tokens=${payload}`),
  },
};
