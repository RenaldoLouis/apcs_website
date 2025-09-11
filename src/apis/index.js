import http from '../services/http';

const handleErrors = (err /* path  payload */) => {
  // const errorMessageKey = err.response?.data?.error.Message;
  const errorMessageKey = err.response;
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

const postBlobRequest = async (path, payload) => {
  try {
    const res = await http.postBlob(path, payload);
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
    sendEmail: (data) => postRequest(`/api/v1/apcs/sendEmail`, data),
    sendEmailWinner: (data) => postRequest(`/api/v1/apcs/sendEmailWinner`, data),
    sendEmailMarketing: (data) => postRequest(`/api/v1/apcs/sendEmailMarketing`, data),
    sendEmailPaymentRequest: (data) => postRequest(`/api/v1/apcs/sendEmailPaymentRequest`, data),
    sendEmailNotifyApcs: (data) => postRequest(`/api/v1/apcs/sendEmailNotifyApcs`, data),
    sendEmailNotifyBulkUpdateRegistrant: (data) => postRequest(`/api/v1/apcs/sendEmailNotifyBulkUpdateRegistrant`, data),
  },
  galery: {
    getGalery: (eventName) => getRequest(`/api/v1/apcs/getGaleries?eventName=${eventName}`),
    getVideos: () => getRequest(`/api/v1/apcs/getVideos`)
  },
  aws: {
    postSignedUrl: (directoryname, fileName) => postRequest(`/api/v1/apcs/signed-url-images?directoryname=${directoryname}&fileName=${fileName}`),
    downloadFiles: (files) => postBlobRequest(`/api/v1/apcs/download-files-aws`, files),
    downloadAllFiles: (files) => postBlobRequest(`/api/v1/apcs/download-all-files-aws`, files),
  },
  paymentGatewayFlow: {
    create: (data) => postRequest(`/api/v1/apcs/paymentIntegration/bookings`, data),
    checkStatus: (bookingId) => postRequest(`/api/v1/apcs/paymentIntegration/bookings/status?bookingId=${bookingId}`),
  },
  bookings: {
    saveSeatBookProfileInfo: (data) => postRequest(`/api/v1/apcs/saveSeatBookProfileInfo`, data),
    sendSeatBookingEmail: (data) => postRequest(`/api/v1/apcs/sendSeatBookingEmail`, data),
    verifySeatToken: (data) => postRequest(`/api/v1/apcs/verify-seat-token`, data),
    confirmSeatSelection: (data) => postRequest(`/api/v1/apcs/confirm-seats`, data),
    sendEmailConfirmSeatSelection: (data) => postRequest(`/api/v1/apcs/sendEmailConfirmSeatSelection`, data),
  },
  tickets: {
    verify: (eventName) => getRequest(`/api/v1/apcs/getGaleries?eventName=${eventName}`),
  },
};
