import http from '../services/http';

const handleErrors = (err /* path  payload */) => {
  const errorMessageKey = err.response?.data?.error.Message;
  return { error: errorMessageKey };
};

const getRequest = async (path, params) => {
  try {
    return await http.get(path, params);
  } catch (err) {
    return handleErrors(err);
  }
};

const postRequest = async (path, payload) => {
  try {
    const res = await http.post(path, payload);
    return res;
  } catch (err) {
    return handleErrors(err);
  }
};

const putRequest = async (path, payload) => {
  try {
    const res = await http.put(path, payload);
    return res;
  } catch (err) {
    return handleErrors(err);
  }
};

const patchRequest = async (path, payload) => {
  try {
    return await http.patch(path, payload);
  } catch (err) {
    return handleErrors(err);
  }
};

const deleteRequest = async (path) => {
  try {
    return await http.delete(path);
  } catch (err) {
    return handleErrors(err);
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  auth: {
    login: (payload) => postRequest('/admin/login', payload),
  },
  banners: {
    getAllBanners: () => getRequest('/secure/admin/banners'),
    getBannerWithExternalID: (bannerID) => getRequest(`/secure/admin/banners/${bannerID}`),
    createBanner: (payload) => postRequest('/secure/admin/banners', payload),
    updateBanner: (bannerId, payload) => putRequest(`/secure/admin/banners/${bannerId}`, payload),
    deleteBanner: (bannerId) => deleteRequest(`/secure/admin/banners/${bannerId}`),
  },
  medicalStaff: {
    // getMedicalStaff: (status) => getRequest(`/secure/admin/staff?status=${status}`),
    getMedicalStaff: (status, role) => getRequest(`/secure/admin/staff`, { status, role }),
    editStaff: (status) => getRequest(`/secure/admin/staff?status=${status}`),
    approveStaff: (staffData) => putRequest(`/secure/admin/staff/approval`, staffData),
    updateStaff: (staffID, staffData) => patchRequest(`/secure/admin/staff/${staffID}`, staffData),
  },
  payment: {
    createPayment: (data) => postRequest(`/api/v1/apcs/createPayment`, data)
  },
  email: {
    sendEmail: () => postRequest(`/api/v1/apcs/sendEmail`)
  }
};